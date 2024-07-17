import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishDto, user: User) {
    const wish = {
      ...dto,
      owner: user,
    };

    await this.wishesRepository.save(wish);
  }

  async findOneById(id: number): Promise<Wish> {
    const wish = this.wishesRepository.findOne({
      where: { id },
      relations: {
        offers: true,
        owner: true,
      },
    });

    if (!wish) throw new NotFoundException('Такой подарок не найден!');

    return wish;
  }

  async getLastWishes(amount: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: amount,
    });

    return wishes;
  }

  async getTopWishes(amount: number): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: amount,
    });

    return wishes;
  }

  async updateById(wishID: number, userID: number, dto: UpdateWishDto) {
    const wish = await this.findOneById(wishID);

    if (wish.owner.id !== userID)
      throw new BadRequestException(
        'Вы не можете редактировать чужие подарки!',
      );

    if (wish.raised > 0 && wish.price !== dto.price)
      throw new BadRequestException(
        'Вы не можете изменить стоимость подарка, так как уже есть желающие скинуться.',
      );

    await this.wishesRepository.update(wishID, dto);
  }

  async removeById(wishID: number, userID: number): Promise<Wish> {
    const wish = await this.findOneById(wishID);

    if (wish.owner.id !== userID)
      throw new BadRequestException('Вы не можете удалять чужие подарки!');

    await this.wishesRepository.delete(wishID);

    return wish;
  }

  async copyById(wishID: number, user: User) {
    const wish = await this.findOneById(wishID);

    if (!wish) throw new NotFoundException('Такой подарок не найден!');

    if (user.id === wish.owner.id)
      throw new BadRequestException('Вы не можете скопировать свой подарок!');

    const copyWish: CreateWishDto = {
      name: wish.name,
      link: wish.link,
      image: wish.image,
      price: wish.price,
      description: wish.description,
    };

    await this.create(copyWish, user);

    await this.wishesRepository.update(wishID, {
      copied: (wish.copied += 1),
    });
  }
}
