import {
  IsNotEmpty,
  IsString,
  Length,
  IsEmail,
  IsUrl,
  IsDate,
} from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User {
  // Уникальный числовой идентификатор
  @PrimaryGeneratedColumn()
  @IsDate()
  id: number;

  // Дата создания
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  // Дата изменения
  @UpdateDateColumn()
  updatedAt: Date;

  // Имя пользователя
  @Column({
    type: 'varchar',
    length: 30,
    unique: true,
  })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  // Информация о пользователе
  @Column({
    type: 'varchar',
    length: 30,
    default: 'Пока ничего не рассказал о себе',
  })
  @IsString()
  @Length(2, 200)
  about: string;

  //Ссылка на аватар
  @Column({
    default: 'https://i.pravatar.cc/300',
  })
  @IsUrl()
  avatar: string;

  //Адрес электронной почты
  @Column({
    unique: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  //Пароль
  @Column()
  @IsNotEmpty()
  @IsString()
  password: string;

  //Список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  //Список подарков, на которые скидывается пользователь
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  //Список вишлистов, которые создал пользователь
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
