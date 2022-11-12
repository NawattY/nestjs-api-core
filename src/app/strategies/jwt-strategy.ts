import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AppConfigService } from 'src/config/app/config.service';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/app/entities/default/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private appConfigService: AppConfigService,
  ) {
    super({
      secretOrKey: appConfigService.jwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  async validate(payload: JwtPayload) {
    const { id } = payload;
    const user = this.userRepository.findOne(id);

    if (!user) {
      throw new ForbiddenException();
    }

    return user;
  }
}

export interface JwtPayload {
  id: number;
  username: string;
  merchant: number;
}
