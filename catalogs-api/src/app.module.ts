import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from './logger/logger.module';
import { CatalogsModule } from './catalogs/catalogs.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    LoggerModule,
    MongooseModule.forRoot(
      process.env.MONGO_URI,
    ),
    CatalogsModule,
  ],
})
export class AppModule {}
