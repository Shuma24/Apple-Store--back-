import {
  Body,
  Controller,
  HttpCode,
  HttpException,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UpdateResult } from 'typeorm';
import { Response } from 'express';

import { AuthenticationService } from './authentication.service';
import { CreateUserDTO } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entity/user.entity';
import { LoginUserDTO } from 'src/user/dto/login-dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { JwtAuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { UserRequestDTO } from 'src/user/dto/user-request.dto';
import { EmailConfirmationService } from './email/emailConfirmation.service';

@Serialize(UserRequestDTO)
@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly _authService: AuthenticationService,
    private readonly _emailConfirmationService: EmailConfirmationService,
  ) {}

  @HttpCode(201)
  @Post('register')
  async register(@Body() dto: CreateUserDTO): Promise<User | HttpException> {
    const user = await this._authService.signup(dto);
    return user;
  }

  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: LoginUserDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<HttpException | UserRequestDTO> {
    const login = await this._authService.signin(dto, res);
    return login;
  }

  @HttpCode(200)
  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(
    @CurrentUser() user: User,
    @Res({ passthrough: true }) resp: Response,
  ): Promise<HttpException | UserRequestDTO> {
    return this._authService.logout(user, resp);
  }

  @HttpCode(200)
  @Post('confirm-user')
  async confirmUserEmail(@Query('token') token: string): Promise<{
    result: UpdateResult;
    status: string;
  }> {
    const email = await this._emailConfirmationService.decodeConfiramationToken(
      token,
    );
    const result = await this._emailConfirmationService.confirmEmail(email);

    return {
      result,
      status: `Емейл підтверджено, тепер можна логінитись на сайті`,
    };
  }
}
