import { Module } from '@nestjs/common';
import { CatalogsController } from './catalogs.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CatalogSchema, Catalog } from './schemas/catalog.schema';
import { CatalogsService } from './catalogs.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Catalog.name, schema: CatalogSchema }]),
  ],
  controllers: [CatalogsController],
  providers: [CatalogsService],
})
export class CatalogsModule {}
