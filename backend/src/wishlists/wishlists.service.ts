import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { User } from 'src/users/entities/user.entity';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListRepository: Repository<Wishlist>,
    @InjectRepository(Wish) private wishRepository: Repository<Wish>,
  ) {}

  async create(dto: CreateWishlistDto, user: User): Promise<Wishlist> {
    const wishes = await this.wishRepository.findBy({ id: In(dto.itemsId) });

    return await this.wishListRepository.save({
      ...dto,
      items: wishes,
      owner: user,
    });
  }

  findAll(): Promise<Wishlist[]> {
    return this.wishListRepository.find();
  }

  async findOneById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishListRepository.findOne({
      where: { id },
      relations: { owner: true, items: true },
    });

    if (!wishlist) throw new NotFoundException('Список не найден!');

    return wishlist;
  }

  async updateById(
    listID: number,
    userID: number,
    dto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const list = await this.findOneById(listID);

    if (list.owner.id !== userID)
      throw new BadRequestException(
        'Вы не можете редактировать чужие списки подарков!',
      );

    const wishes = await this.wishRepository.findBy({
      id: In(dto.itemsID || []),
    });

    return await this.wishListRepository.save({
      ...list,
      name: dto.name,
      image: dto.image,
      items: wishes.concat(list.items),
    });
  }

  async removeById(listID: number, userID: number): Promise<Wishlist> {
    const list = await this.findOneById(listID);

    if (list.owner.id !== userID)
      throw new BadRequestException(
        'Вы не можете удалять чужие списки подарков!',
      );

    await this.wishListRepository.delete(listID);

    return list;
  }
}
