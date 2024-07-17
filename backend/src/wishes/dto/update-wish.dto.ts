import { PartialType } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsUrl,
  IsNumber,
  Min,
  IsOptional,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsString()
  @Length(1, 250)
  @IsOptional()
  name: string;

  @IsUrl()
  @IsOptional()
  link: string;

  @IsUrl()
  @IsOptional()
  image: string;

  @IsNumber()
  @Min(1)
  @IsOptional()
  price: number;

  @IsString()
  @Length(1, 1024)
  @IsOptional()
  description: string;
}
