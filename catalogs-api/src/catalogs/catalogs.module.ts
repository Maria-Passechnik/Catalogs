import { Module } from '@nestjs/common';
import { CatalogsController } from './catalogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogSchema, Catalog } from './schemas/catalog.schema';
import { CatalogsService } from './catalogs.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Catalog.name, schema: CatalogSchema }]),
    ScheduleModule.forRoot()
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
