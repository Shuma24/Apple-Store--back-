import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcrypt';
import { Response } from 'express';

import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { LoginUserDTO } from 'src/user/dto/login-dto';
import { UserRequestDTO } from 'src/user/dto/user-request.dto';
import { User } from 'src/user/entity/user.entity';
import { UserService } from 'src/user/user.service';
import { EmailConfirmationService } from './email/emailConfirmation.service';
import {
  BAD_PASSWORD,
  DONT_EMAIL_OR_NOT_REGISTER,
  EMAIL_IN_USE,
  SMT_WENT_WRONG,
} from './errors/errors-constatns';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _userService: UserService,
    private readonly jwtService: JwtService,
    private readonly _emailConfirmationService: EmailConfirmationService,
  ) {}

  async signup(dto: CreateUserDTO): Promise<User | HttpException> {
    try {
      const findUserbyEmail = await this._userService.getByEmail(dto.email);
      const findUserbyUsername = await this._userService.getByUsername(
        dto.username,
      );

      if (findUserbyEmail || findUserbyUsername) {
        throw new HttpException(EMAIL_IN_USE, HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const passwordHash = await hash(
        dto.password,
        parseInt(this._configService.get('SALT')),
      );
      dto.password = passwordHash;

      await this._emailConfirmationService.sendVeryficationLink(dto.email);
      return await this._userService.create(dto);
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(
          `${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new HttpException(SMT_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async signin(
    dto: LoginUserDTO,
    res: Response,
  ): Promise<HttpException | UserRequestDTO> {
    try {
      const user = await this._userService.getByEmail(dto.email);

      if (!user) {
        throw new HttpException(
          DONT_EMAIL_OR_NOT_REGISTER,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordCorrect = await compare(dto.password, user.password);

      if (!isPasswordCorrect) {
        throw new HttpException(BAD_PASSWORD, HttpStatus.UNAUTHORIZED);
      }

      const jwt = await this.addJWT(user.id);

      res.cookie('jwt', jwt, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });

      return {
        username: user.username,
        message: 'Login success',
        success: true,
        role: user.role,
        age: user.age,
        phone: user.phone,
        email: user.email,
        confirm: user.isEmailConfirmed,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw new HttpException(`${error.message}`, HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException(SMT_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async logout(
    user: User,
    resp: Response,
  ): Promise<HttpException | UserRequestDTO> {
    try {
      resp.clearCookie('jwt');
      return {
        username: user.username,
        message: 'logout success',
        success: true,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new HttpException(
          `${error.message}`,
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }
      throw new HttpException(SMT_WENT_WRONG, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async checkUser(email: string): Promise<HttpException | UserRequestDTO> {
    if (!email) {
      throw new HttpException('Ви не авторизовані', HttpStatus.UNAUTHORIZED);
    }
    const user = await this._userService.getByEmail(email);
    if (!user) {
      throw new HttpException('Ви не авторизовані', HttpStatus.UNAUTHORIZED);
    }

    return {
      username: user.username,
      message: 'Login success',
      success: true,
      role: user.role,
      age: user.age,
      phone: user.phone,
      email: user.email,
      confirm: user.isEmailConfirmed,
    };
  }

  //help function
  async addJWT(id: number) {
    const payload = { id };
    return await this.jwtService.signAsync(payload);
  }
}
