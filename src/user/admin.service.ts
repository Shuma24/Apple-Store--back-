import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DeleteResult, Repository } from 'typeorm';

import { AdminUpdateUserDTO } from './dto/admin-update-user.dto';
import { User } from './entity/user.entity';
import { USER_NOT_FOUND } from './errors/errors-constant';
import { IAdminResponse } from './interface/adminResponse';
import { IQueryAdmin } from './interface/query-admin.interface';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _configService: ConfigService,
  ) {}

  async getAllUsers(
    query: IQueryAdmin,
  ): Promise<HttpException | IAdminResponse> {
    try {
      const queryBuilder = this._userRepository.createQueryBuilder();

      if (query.search) {
        queryBuilder.where(
          'LOWER(email) LIKE :search OR LOWER(username) LIKE :search',
          {
            search: `%${query.search.toLowerCase()}%`,
          },
        );
      }

      if (query.sortBy) {
        queryBuilder.orderBy(
          `${query.sortBy}`,
          query.order.toUpperCase() as any,
        );
      }

      const page: number = parseInt(query.page) || 1;
      const total: number = await queryBuilder.getCount();
      const perPage: number = +query.limit || 4;
      queryBuilder.offset((page - 1) * perPage).limit(perPage);
      const lastPage = Math.ceil(total / perPage);

      const users = await queryBuilder.getMany();

      return { users, total, page, lastPage };
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new HttpException(`${error.message}`, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  async updateUser(
    id: number,
    dto: AdminUpdateUserDTO,
  ): Promise<User | HttpException> {
    try {
      if (!id) {
        return null;
      }

      const user = await this._userRepository.findOne({
        where: { id: id },
      });

      if (!user) {
        throw new HttpException(USER_NOT_FOUND, HttpStatus.BAD_GATEWAY);
      }

      if (dto.password) {
        const passwordHash = await hash(
          dto.password,
          parseInt(this._configService.get('SALT')),
        );
        dto.password = passwordHash;
      }
      Object.assign(user, dto);

      return await this._userRepository.save(user);
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new HttpException(`${error.message}`, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  async deleteUser(id: number): Promise<HttpException | DeleteResult> {
    try {
      if (!id) {
        null;
      }

      const user = await this._userRepository.findOne({ where: { id: id } });

      if (!user) {
        throw new HttpException(USER_NOT_FOUND, HttpStatus.BAD_GATEWAY);
      }

      return await this._userRepository.delete({ id: user.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        return new HttpException(`${error.message}`, HttpStatus.BAD_GATEWAY);
      }
    }
  }
}
