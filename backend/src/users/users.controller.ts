import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { User } from './entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getAuthUser(@Req() { user }: { user: User }): Promise<User> {
    const userData = await this.usersService.findOneById(user.id);

    if (!userData) throw new NotFoundException('Пользователь не существует!');

    delete userData.password;

    return userData;
  }

  @Patch('me')
  async updateAuthUser(
    @Req() { user }: { user: User },
    @Body() dto: UpdateUserDto,
  ): Promise<User> {
    const updUserData = await this.usersService.updateById(user.id, dto);

    delete updUserData.password;

    return updUserData;
  }

  @Get('me/wishes')
  async getAuthUserWishes(@Req() { user }: { user: User }) {
    return await this.usersService.getUserWishes(user.username);
  }

  @Get(':username')
  async getUserByUsername(@Param('username') username: string): Promise<User> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user) throw new NotFoundException('Пользователь не существует');

    delete user.password;
    delete user.email;

    return user;
  }

  @Get(':username/wishes')
  async getUserWishes(@Param('username') username: string): Promise<Wish[]> {
    return await this.usersService.getUserWishes(username);
  }

  @Post('find')
  async findUsers(@Body('query') query: string): Promise<User | User[]> {
    const users = await this.usersService.findMany(query);

    if (!users) throw new NotFoundException('Пользователи не найдены');

    if (Array.isArray(users)) {
      for (const user of users) {
        delete user.password;
      }
    } else {
      delete users.password;
    }

    return users;
  }
}
