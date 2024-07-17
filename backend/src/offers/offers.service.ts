import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateOfferDto } from './dto/create-offer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Wish } from 'src/wishes/entities/wish.entity';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer) private offerRepository: Repository<Offer>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
    private readonly wishesService: WishesService,
  ) {}

  async create(dto: CreateOfferDto, user: User) {
    const wish = await this.wishesService.findOneById(dto.itemId);

    if (user.id === wish.owner.id)
      throw new BadRequestException(
        'Нельзя вносить деньги на собственные подарки!',
      );

    if (dto.amount > wish.price - wish.raised)
      throw new BadRequestException('Сумма превышает остаток сбора!');

    const offer = {
      amount: dto.amount,
      hidden: dto.hidden,
      item: wish,
      user,
    };

    await this.wishRepository.increment({ id: wish.id }, 'raised', dto.amount);

    await this.offerRepository.save(offer);
  }

  async findAll(): Promise<Offer[]> {
    return await this.offerRepository.find({
      relations: ['item', 'user'],
    });
  }

  async findOneById(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });

    if (!offer) throw new NotFoundException('Такого предожения не найдено!');

    delete offer.user.password;

    return offer;
  }
}
