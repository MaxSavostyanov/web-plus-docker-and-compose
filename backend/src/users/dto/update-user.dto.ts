import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(1, 64)
  username: string;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @Length(2)
  password: string;

  @IsOptional()
  @IsString()
  @Length(0, 200)
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;
}
