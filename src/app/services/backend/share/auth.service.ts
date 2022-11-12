import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'crypto';
import { AuthJwtResponseInterface } from '@interfaces/auth/jwt-response.interface';
import { AppConfigService } from 'src/config/app/config.service';
import { JwtService } from '@nestjs/jwt';
import { addMinutes, differenceInSeconds, format, isBefore } from 'date-fns';
import { get, isEmpty } from 'lodash';
import { UserEntity } from 'src/app/entities/default/user.entity';
import { UserType } from 'src/app/common/enums/user-type';
import { UserException } from 'src/app/exceptions/app/user.exception';
import { AuthRefreshTokenEntity } from 'src/app/entities/default/auth-refresh-token.entity';
import { AuthAccessTokenEntity } from 'src/app/entities/default/auth-access-token.entity';
import { AuthException } from 'src/app/exceptions/app/auth.exception';
import { ConfigService } from '@nestjs/config';
import { AuthLoginDto } from '@dtos/v1/backend/share/auth/auth-login.dto';
import { AuthLoginResponseInterface } from '@interfaces/auth/login-response.interface';
import { AuthRefreshTokenResponseInterface } from '@interfaces/auth/refresh-token-response.interface';
import { getUrlImage } from '@helpers/thumbnail.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(AuthAccessTokenEntity)
    private authAccessTokenRepository: Repository<AuthAccessTokenEntity>,
    @InjectRepository(AuthRefreshTokenEntity)
    private authRefreshTokenRepository: Repository<AuthRefreshTokenEntity>,
    private appConfigService: AppConfigService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateLogin(
    bodyEmail: string,
    bodyPassword: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        email: bodyEmail,
      },
    });

    if (!user) {
      throw UserException.notFound();
    }

    const isMatchPassword = await bcrypt.compare(bodyPassword, user.password);

    if (!isMatchPassword) {
      throw UserException.credentialsMismatch();
    }

    if (user.isActive === 0) {
      throw UserException.userInActive();
    }

    return user;
  }

  async login(authLoginDto: AuthLoginDto): Promise<AuthLoginResponseInterface> {
    const user = await this.validateLogin(
      authLoginDto.email,
      authLoginDto.password,
    );
    const tokenJwt = await this.generateJwt(user);

    let urlImage = null;
    if (!isEmpty(user.profileImage)) {
      urlImage = getUrlImage(user.profileImage).original;
    }

    return {
      fullName: user.fullName,
      profileImage: urlImage,
      type: user.type,
      accessToken: tokenJwt.accessToken,
      refreshToken: tokenJwt.refreshToken,
    };
  }

  async findById(id: number, query?: any): Promise<UserEntity> {
    const user = this.userRepository
      .createQueryBuilder('users')
      .where('users.id = :id', { id })
      .andWhere('users.is_active = 1');

    if (query?.include?.includes(UserType.MERCHANT)) {
      user.innerJoinAndSelect('users.merchant', 'merchant.id');
    }

    const items = await user.getOne();

    if (!items) {
      throw UserException.notFound();
    }

    return items;
  }

  async getUserByAccessToken(accessToken: string): Promise<UserEntity> {
    try {
      const decoded: any = this.jwtService.verify(accessToken);

      const authAccessToken = await this.authAccessTokenRepository.findOne({
        token: get(decoded, 'jti'),
      });

      if (!authAccessToken) {
        throw new UnauthorizedException();
      }

      const user = await this.userRepository
        .createQueryBuilder()
        .where('id = :id', { id: authAccessToken.userId })
        .andWhere('is_active = 1')
        .getOne();

      if (!user) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<AuthRefreshTokenResponseInterface> {
    const authRefreshToken = await this.authRefreshTokenRepository
      .createQueryBuilder('authRefreshToken')
      .innerJoinAndSelect('authRefreshToken.authAccessToken', 'authAccessToken')
      .where('authRefreshToken.token = :token', { token: refreshToken })
      .getOne();

    if (!authRefreshToken) {
      throw AuthException.notFound();
    }

    const user = await this.findById(authRefreshToken.authAccessToken.userId);

    const accessTokenJwt: string = this.jwtService.sign(
      { jti: authRefreshToken.authAccessToken.token },
      {
        expiresIn: differenceInSeconds(
          new Date(authRefreshToken.authAccessToken.expiredAt),
          new Date(),
        ),
      },
    );

    const accessRefreshExpiredAt = get(authRefreshToken, 'expiredAt');
    const refreshTokenJwt: string = this.jwtService.sign(
      { jti: authRefreshToken.authAccessToken.token },
      {
        expiresIn: differenceInSeconds(
          new Date(accessRefreshExpiredAt),
          new Date(),
        ),
      },
    );

    let token = {
      accessToken: accessTokenJwt,
      refreshToken: refreshTokenJwt,
    };

    if (
      accessRefreshExpiredAt &&
      isBefore(accessRefreshExpiredAt, new Date())
    ) {
      try {
        await this.authRefreshTokenRepository.delete({
          authAccessTokenId: authRefreshToken.authAccessTokenId,
        });

        const generateJwt = await this.generateJwt(user);

        token = {
          accessToken: generateJwt.accessToken,
          refreshToken: generateJwt.refreshToken,
        };
      } catch (error) {
        throw AuthException.refreshTokenError();
      }
    }

    return {
      fullName: user.fullName,
      profileImage: user.profileImage,
      type: user.type,
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
    };
  }

  private async generateJwt(
    user: UserEntity,
  ): Promise<AuthJwtResponseInterface> {
    try {
      const expiredAt = format(
        addMinutes(new Date(), this.appConfigService.accessTokenExpiredIn),
        'yyyy-MM-dd HH:mm:ss',
      );

      const accessToken = await this.authAccessTokenRepository.save({
        userId: user.id,
        token: randomUUID(),
        expiredAt,
      });

      const refreshToken = await this.authRefreshTokenRepository.save({
        authAccessTokenId: accessToken.id,
        token: randomUUID(),
        expiredAt,
      });

      const accessTokenJwt: string = this.jwtService.sign(
        { jti: accessToken.token },
        {
          expiresIn: differenceInSeconds(
            new Date(accessToken.expiredAt),
            new Date(),
          ),
        },
      );

      const refreshTokenJwt: string = this.jwtService.sign(
        { jti: refreshToken.token },
        {
          expiresIn: differenceInSeconds(
            new Date(refreshToken.expiredAt),
            new Date(),
          ),
        },
      );

      return {
        accessToken: accessTokenJwt,
        refreshToken: refreshTokenJwt,
      };
    } catch (error) {
      throw AuthException.generateJwtError();
    }
  }

  async logout(user: UserEntity): Promise<void> {
    const userId = get(user, 'id');
    const accessToken = await this.authAccessTokenRepository.findOne({
      userId: userId,
    });

    if (accessToken) {
      await this.authRefreshTokenRepository.delete({
        authAccessTokenId: accessToken.id,
      });

      await this.authAccessTokenRepository.delete(accessToken.id);
    }
  }
}
