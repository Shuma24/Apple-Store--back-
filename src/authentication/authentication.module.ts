import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';

import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JWTConfig } from 'src/configs/jwt.config';
import { JWTStrategy } from './jwt/jwt.strategy';
import { EmailService } from './email/email.service';
import { EmailConfirmationService } from './email/emailConfirmation.service';

@Module({
  imports: [
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: JWTConfig,
    }),
  ],
  providers: [
    AuthenticationService,
    JWTStrategy,
    EmailService,
    EmailConfirmationService,
  ],
  controllers: [AuthenticationController],
  exports: [JWTStrategy],
})
export class AuthenticationModule {}
