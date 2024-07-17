import { IsString, Length, IsUrl, IsNumber, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';

@Entity()
export class Wish {
  @PrimaryGeneratedColumn()
  id: number;

  //Дата создания
  @CreateDateColumn()
  @IsDate()
  createdAt: Date;

  //Дата изменения
  @UpdateDateColumn()
  @IsDate()
  updatedAt: Date;

  //Название подарка
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  //Ссылка на интернет-магазин, в котором можно приобрести подарок
  @Column()
  @IsUrl()
  link: string;

  //Ссылка на изображение подарка
  @Column()
  @IsUrl()
  image: string;

  //Стоимость подарка
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  @IsNumber()
  price: number;

  //Сумма предварительного сбора или сумма, которую пользователи сейчас готовы скинуть на подарок
  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsNumber()
  raised: number;

  //Ссылка на пользователя, которые добавил пожелание подарка
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  //Описание подарка
  @Column()
  @IsString()
  @Length(1, 1024)
  description: string;

  //Заявки скинуться от других пользователей
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: [];

  //Счётчик тех, кто скопировал подарок себе
  @Column({
    default: 0,
  })
  copied: number;
}
