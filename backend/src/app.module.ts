import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import config from './utils/config';

const rootConfig = config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: rootConfig.dbHost,
      port: rootConfig.dbPort,
      username: rootConfig.dbUsername,
      password: rootConfig.dbPassword,
      database: rootConfig.dbName,
      entities: ['dist/*/entities/*.entity.js'],
      synchronize: true,
      autoLoadEntities: true,
    }),
    ConfigModule.forRoot({
      load: [config],
      isGlobal: true,
    }),
    AuthModule,
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
