import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { Offer } from './entities/offer.entity';
import { User } from 'src/users/entities/user.entity';
import { JwtGuard } from 'src/auth/jwt-auth.guard';

@Controller('offers')
export class OffersController {
  constructor(private readonly offersService: OffersService) {}

  @Get()
  async getAll(): Promise<Offer[]> {
    return this.offersService.findAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string): Promise<Offer> {
    return this.offersService.findOneById(Number(id));
  }

  @UseGuards(JwtGuard)
  @Post()
  async create(@Req() { user }: { user: User }, @Body() dto: CreateOfferDto) {
    await this.offersService.create(dto, user);

    return {};
  }
}
