import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';

import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entity/user.entity';
import { USER_NOT_FOUND } from './errors/errors-constant';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly _userRepository: Repository<User>,
    private readonly _configService: ConfigService,
  ) {}

  async create(dto: CreateUserDTO): Promise<User> {
    const user = this._userRepository.create(dto);
    return await this._userRepository.save(user);
  }

  async getByEmail(dtoEmail: string): Promise<User> {
    const user = await this._userRepository.findOneBy({
      email: dtoEmail,
    });
    return user;
  }

  async getByUsername(dtoUsername: string): Promise<User> {
    const user = await this._userRepository.findOneBy({
      username: dtoUsername,
    });
    return user;
  }

  async getById(id: number): Promise<User> {
    const user = await this._userRepository.findOneBy({ id: id });
    if (!user) {
      throw new HttpException(USER_NOT_FOUND, HttpStatus.BAD_GATEWAY);
    }

    return user;
  }

  async updateCurrentUser(
    currentUserId: number,
    dto: UpdateUserDTO,
  ): Promise<User | HttpException> {
    try {
      if (!currentUserId) {
        return null;
      }

      const currentUser = await this._userRepository.findOne({
        where: { id: currentUserId },
      });

      if (!currentUser) {
        throw new HttpException(USER_NOT_FOUND, HttpStatus.BAD_GATEWAY);
      }

      if (dto.password) {
        const passwordHash = await hash(
          dto.password,
          parseInt(this._configService.get('SALT')),
        );
        dto.password = passwordHash;
      }

      Object.assign(currentUser, dto);

      return await this._userRepository.save(currentUser);
    } catch (error) {
      if (error instanceof Error) {
        return new HttpException(`${error.message}`, HttpStatus.BAD_GATEWAY);
      }
    }
  }

  async deleteCurrentUser(
    currentUserId: number,
  ): Promise<HttpException | DeleteResult> {
    try {
      if (!currentUserId) {
        return null;
      }

      return await this._userRepository.delete({ id: currentUserId });
    } catch (error) {
      if (error instanceof Error) {
        return new HttpException(`${error.message}`, HttpStatus.BAD_GATEWAY);
      }
    }
  }
  async markEmailAsConfirmed(email: string): Promise<UpdateResult> {
    return this._userRepository.update({ email }, { isEmailConfirmed: true });
  }
}
