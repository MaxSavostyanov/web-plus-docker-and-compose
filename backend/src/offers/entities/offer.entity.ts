import { IsNumber, IsBoolean } from 'class-validator';
import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Offer {
  @PrimaryGeneratedColumn()
  id: number;

  //Дата создания
  @CreateDateColumn()
  createdAt: Date;

  //Дата изменения
  @UpdateDateColumn()
  updatedAt: Date;

  //ID желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  //Ссылка на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  //Сумма заявки
  @Column({
    type: 'numeric',
    scale: 2,
  })
  @IsNumber()
  amount: number;

  //Флаг, который определяет показывать ли инфомацию о скидывающемся в списке
  @Column({
    default: false,
  })
  @IsBoolean()
  hidden: boolean;
}
