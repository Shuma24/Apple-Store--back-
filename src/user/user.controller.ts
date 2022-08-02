import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  Param,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DeleteResult } from 'typeorm';

import { UserRequestDTO } from './dto/user-request.dto';
import { User } from './entity/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserService } from './user.service';
import { RoleGuard } from 'src/guards/role.guard';
import { Role } from './enums/user-roles.enum';
import { CurrentUser } from './decorators/user.decorator';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AdminService } from './admin.service';
import { AdminRequestUserDTO } from './dto/admin-user-Request.dto';
import { AdminUpdateUserDTO } from './dto/admin-update-user.dto';
import { IQueryAdmin } from './interface/query-admin.interface';
import { IAdminResponse } from './interface/adminResponse';

@Controller('user')
export class UserController {
  constructor(
    private readonly _userService: UserService,
    private readonly _adminService: AdminService,
  ) {}

  @Serialize(UserRequestDTO)
  @HttpCode(200)
  @UseGuards(RoleGuard(Role.User))
  @Get(':id')
  async getById(@Param('id') id: string): Promise<User | HttpException> {
    return await this._userService.getById(parseInt(id));
  }

  @Serialize(UserRequestDTO)
  @HttpCode(200)
  @Put('update')
  @UseGuards(RoleGuard(Role.User))
  async updateCurrentUser(
    @CurrentUser('id') currentUserId: string,
    @Body() dto: UpdateUserDTO,
  ): Promise<UserRequestDTO> {
    const updateuser = await this._userService.updateCurrentUser(
      parseInt(currentUserId),
      dto,
    );

    if (updateuser instanceof User) {
      return {
        username: updateuser.username,
        success: true,
        updated_at: updateuser.updated_at,
      };
    }
  }

  @HttpCode(200)
  @UseGuards(RoleGuard(Role.Admin))
  @Get('admin/all')
  async getAll(
    @Query() query: IQueryAdmin,
  ): Promise<HttpException | IAdminResponse> {
    return await this._adminService.getAllUsers(query);
  }

  @Serialize(AdminRequestUserDTO)
  @HttpCode(200)
  @UseGuards(RoleGuard(Role.Admin))
  @Put('admin/update/:id')
  async setRole(
    @Param('id') id: string,
    @Body() dto: AdminUpdateUserDTO,
  ): Promise<User | HttpException> {
    return await this._adminService.updateUser(parseInt(id), dto);
  }

  @HttpCode(200)
  @UseGuards(RoleGuard(Role.Admin))
  @Delete('admin/delete/:id')
  async deleteUsers(
    @Param('id') id: string,
  ): Promise<HttpException | DeleteResult> {
    return this._adminService.deleteUser(parseInt(id));
  }

  @HttpCode(200)
  @UseGuards(RoleGuard(Role.User))
  @Delete('delete')
  async deleteCurrentUser(
    @CurrentUser('id') currentUserId: string,
  ): Promise<HttpException | DeleteResult> {
    return await this._userService.deleteCurrentUser(parseInt(currentUserId));
  }
}
