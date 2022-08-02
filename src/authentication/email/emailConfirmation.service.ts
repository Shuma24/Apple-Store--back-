import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { UpdateResult } from 'typeorm';
import { EMAIL_IS_CONFIRMED } from '../errors/errors-constatns';
import { EmailService } from './email.service';

@Injectable()
export class EmailConfirmationService {
  constructor(
    private readonly _jwtService: JwtService,
    private readonly _configService: ConfigService,
    private readonly _emailService: EmailService,
    private readonly _userService: UserService,
  ) {}
  sendVeryficationLink(email: string) {
    const payload = { email };

    const token = this._jwtService.sign(payload, {
      secret: this._configService.get('JWT_VERIFICATION_TOKEN_SECRET'),
    });

    const html = `
    <form 
    action="${this._configService.get(
      'EMAIL_CONFIRMATION_URL',
    )}?token=${token}" 
    method="post"
    >
    <div style="text-align: center;">
    <p style="font-size: 24px; color: black; font-weight: bold;"> Привіт, дякую за реєстрацію у нашому магазині, підтвердіть свій емейл та мерщій купляти нові гаджети </p>
    <button style="  background-color: #4CAF50; /* Green */
    border: none;
    color: white;
    padding: 15px 32px;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    font-size: 16px;">Жмакай тут щоб підтвердити свій емейл</button>
    </div>
    </form>`;

    return this._emailService.sendMail({
      to: email,
      subject: 'Email confirmation',
      html: html,
    });
  }

  async decodeConfiramationToken(token: string): Promise<any> {
    try {
      const payload = this._jwtService.decode(token);

      if (typeof payload === 'object' && 'email' in payload) {
        return payload.email;
      }
      throw new BadRequestException();
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new HttpException(
          `${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
    }
  }

  async confirmEmail(email: string): Promise<UpdateResult> {
    const user = await this._userService.getByEmail(email);
    if (user.isEmailConfirmed) {
      throw new BadRequestException(EMAIL_IS_CONFIRMED);
    }
    return await this._userService.markEmailAsConfirmed(email);
  }
}
