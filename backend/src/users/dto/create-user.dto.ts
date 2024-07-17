import { IsEmail, IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(1, 64)
  username: string;

  @IsEmail()
  email: string;

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
