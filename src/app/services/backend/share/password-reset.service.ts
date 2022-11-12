import { PasswordResetRequestDto } from '../../../http/v1/backend/dtos/share/password-reset/password-reset-request.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { addMinutes } from 'date-fns';
import { UserEntity } from '@entities/default/user.entity';
import { UserSecurityCodeEntity } from '@entities/default/user-security-codes.entity';
import { MailService } from '@providers/mail/mail.service';
import { ResetPasswordException } from '@exceptions/app/reset-password.exception';
import { AppConfigService } from 'src/config/app/config.service';
import { UserException } from '@exceptions/app/user.exception';

@Injectable()
export class PasswordResetService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @InjectRepository(UserSecurityCodeEntity)
    private userSecurityCode: Repository<UserSecurityCodeEntity>,
    private mailService: MailService,
    private appConfig: AppConfigService,
    private readonly connection: Connection,
  ) {}

  async request(params: PasswordResetRequestDto): Promise<{ expiredAt: Date }> {
    const user = await this.userRepository.findOne({
      email: params.email,
    });

    if (!user) {
      throw ResetPasswordException.emailNotFound();
    }

    if (user.isActive === 0) {
      throw UserException.userInActive();
    }

    try {
      const userSecurityCode: UserSecurityCodeEntity =
        await this.connection.manager.transaction(async (entityManager) => {
          const userSecurityCode = await entityManager.save(
            UserSecurityCodeEntity,
            {
              type: 'password-reset',
              userId: user.id,
              token: randomUUID(),
              expiredAt: addMinutes(
                new Date(),
                this.appConfig.passwordResetTokenExpiredMinute,
              ),
            },
          );

          //TODO JOB
          this.mailService.sendRequestPassword(
            params.email,
            userSecurityCode.token,
            user.fullName,
          );

          return userSecurityCode;
        });

      return { expiredAt: userSecurityCode.expiredAt };
    } catch (error: any) {
      throw ResetPasswordException.sendEmailFail();
    }
  }
}
