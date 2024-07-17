import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Like, Repository } from 'typeorm';
import { Wish } from 'src/wishes/entities/wish.entity';
import { saltOrRounds } from 'src/utils/constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const hashPassword = await bcrypt.hash(dto.password, saltOrRounds);

    const userDTO = {
      ...dto,
      password: hashPassword,
    };

    const user = await this.usersRepository.save(userDTO);
    return user;
  }

  async findOneById(id: number): Promise<User> {
    return await this.usersRepository.findOneBy({ id });
  }

  async findOneByUsername(username: string): Promise<User> {
    return this.usersRepository.findOneBy({ username });
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.usersRepository.findOneBy({ email });
  }

  async findMany(query: string): Promise<User | User[]> {
    return await this.usersRepository.find({
      where: [{ username: Like(`${query}%`) }, { email: Like(`${query}%`) }],
    });
  }

  async updateById(id: number, dto: UpdateUserDto): Promise<User> {
    const user = await this.findOneById(id);

    if (dto.username && dto.username !== user.username) {
      const match = await this.findOneByUsername(dto.username);
      if (match)
        throw new BadRequestException('Такой пользователь уже сущевствует!');
    }

    if (dto.email && dto.email !== user.email) {
      const match = await this.findOneByEmail(dto.email);
      if (match)
        throw new BadRequestException('Такой пользователь уже сущевствует!');
    }

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, saltOrRounds);
    }

    const updatedUserData: User = {
      ...user,
      username: dto?.username,
      email: dto?.email,
      password: dto?.password,
      about: dto?.about,
      avatar: dto?.avatar,
    };

    await this.usersRepository.update(id, updatedUserData);

    return await this.findOneById(id);
  }

  async getUserWishes(username: string): Promise<Wish[]> {
    const user = await this.usersRepository.findOne({
      where: {
        username,
      },
      relations: {
        wishes: true,
      },
    });
    if (!user) {
      throw new NotFoundException(
        `Пользователь с именем ${username} не найден`,
      );
    }
    return user.wishes;
  }
}
