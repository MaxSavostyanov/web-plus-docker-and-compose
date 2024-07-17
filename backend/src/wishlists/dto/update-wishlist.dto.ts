import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import {
  IsString,
  Length,
  IsUrl,
  IsArray,
  IsNumber,
  IsOptional,
  Max,
} from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  itemsID: number[];

  @IsOptional()
  @IsString()
  @Max(1500)
  description?: string;
}
