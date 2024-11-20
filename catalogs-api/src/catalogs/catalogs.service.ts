import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Catalog } from './schemas/catalog.schema';
import { CreateCatalogDto } from './dtos/create-catalog.dto';
import { UpdateCatalogDto } from './dtos/update-catalog.dto';
import { logger } from 'src/config/logger.config';
import { performBatchBulkWrite } from 'src/common/utils/bulk-operation.util';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectModel(Catalog.name) private readonly catalogModel: Model<Catalog>,
  ) {}

  async getAll(page: number, limit: number) {
    try {
      const skip = (page - 1) * limit;

      const [data, total] = await Promise.all([
        this.catalogModel.find().skip(skip).limit(limit),
        this.catalogModel.countDocuments(),
      ]);

      logger.info('Catalogs fetched successfully');
      return { data, total };
    } catch (error) {
      logger.error('Failed to fetch catalogs');
      throw new BadRequestException('Failed to fetch catalogs', error.message);
    }
  }

  async create(createCatalogDto: CreateCatalogDto) {
    try {
      if (createCatalogDto.isPrimary) {
        await this.handleIsPrimaryUpdate(createCatalogDto.vertical);
        logger.info('Catalogs isPrimary updated successfully');
      }
      const catalog = new this.catalogModel(createCatalogDto);
      const newCatalog = await catalog.save();
      logger.info('Catalog created successfully');
      return newCatalog;
    } catch (error) {
      logger.error('Failed to create new catalog');
      throw new BadRequestException(
        'Failed to create new catalog: ' + error.message,
      );
    }
  }

  async update(id: string, updateCatalogDto: UpdateCatalogDto) {
    try {
      const existingCatalog = await this.catalogModel.findById(id);
      if (!existingCatalog) {
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }

      if (updateCatalogDto.isPrimary) {
        await this.handleIsPrimaryUpdate(existingCatalog.vertical);
        logger.info('Catalogs isPrimary updated successfully');
      }

      updateCatalogDto.indexedAt = new Date();

      const updatedCatalog = await this.catalogModel.findByIdAndUpdate(
        id,
        updateCatalogDto,
        {
          new: true,
        },
      );
      logger.info('Catalogs updated successfully');
      return updatedCatalog;
    } catch (error) {
      logger.error('Failed to update catalog');
      throw new BadRequestException(
        'Failed to update catalog: ' + error.message,
      );
    }
  }

  async delete(id: string) {
    try {
      const deletedCatalog = await this.catalogModel.findByIdAndDelete(id);
      if (!deletedCatalog) {
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }
      logger.info('Catalog deleted successfully');
    } catch (error) {
      logger.error('Failed to delete catalog');
      throw new BadRequestException(
        'Failed to delete catalog: ' + error.message,
      );
    }
  }

  async deleteBulk(ids: string[]) {
    try {
      const operations = ids.map((id) => ({
        deleteOne: {
          filter: { _id: id },
        },
      }));

      await performBatchBulkWrite(this.catalogModel, operations);
      logger.info('Catalogs deleted successfully');
    } catch (error) {
      logger.error('Failed to delete catalogs');
      throw new BadRequestException(
        'Failed to delete catalogs: ' + error.message,
      );
    }
  }

  private async handleIsPrimaryUpdate(vertical: string) {
    const operations = await this.catalogModel
      .find({ vertical, isPrimary: true })
      .then((documents) =>
        documents.map((doc) => ({
          updateOne: {
            filter: { _id: doc._id },
            update: { $set: { isPrimary: false, indexedAt: new Date() } },
          },
        })),
      );

    if (operations.length) {
      await performBatchBulkWrite(this.catalogModel, operations);
    }
  }
}
