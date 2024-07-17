import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { JwtGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { AMOUNT_LAST_WISHES, AMOUNT_TOP_WISHES } from 'src/utils/constants';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get('last')
  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesService.getLastWishes(AMOUNT_LAST_WISHES);
  }

  @Get('top')
  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesService.getTopWishes(AMOUNT_TOP_WISHES);
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getWishById(@Param('id') id: string): Promise<Wish> {
    return await this.wishesService.findOneById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() { user }: { user: User },
    @Body() dto: CreateWishDto,
  ): Promise<Record<string, never>> {
    await this.wishesService.create(dto, user);

    return {};
  }

  @UseGuards(JwtGuard)
  @Post(':id/copy')
  async copyWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Record<string, never>> {
    await this.wishesService.copyById(Number(id), user);

    return {};
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
    @Body() dto: UpdateWishDto,
  ): Promise<Record<string, never>> {
    await this.wishesService.updateById(Number(id), user.id, dto);

    return {};
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async deleteWish(
    @Req() { user }: { user: User },
    @Param('id') id: string,
  ): Promise<Wish> {
    return await this.wishesService.removeById(Number(id), user.id);
  }
}
