import { IsString, Length, IsUrl, IsDate } from 'class-validator';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Wishlist {
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

  //Название списка
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  //Описание подборки
  @Column({ nullable: true })
  @IsString()
  @Length(0, 1500)
  description: string;

  //Обложка для подборки
  @Column()
  @IsUrl()
  image: string;

  //Набор ссылок на подарки
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];

  //Владелец списка
  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
