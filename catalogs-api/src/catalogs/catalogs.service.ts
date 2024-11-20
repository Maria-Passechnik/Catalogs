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
import { Cron } from '@nestjs/schedule';

@Injectable()
export class CatalogsService {
  constructor(
    @InjectModel(Catalog.name) private readonly catalogModel: Model<Catalog>,
  ) {}

  @Cron('0 0 * * *') // Runs at midnight every day
  async handleAutomaticIndexing() {
    try {
      logger.info('Starting automatic indexing process for all catalogs...');
      const currentTimestamp = new Date();

      const result = await this.catalogModel.updateMany(
        { locked: { $ne: true } },
        {
          $set: { indexedAt: currentTimestamp, locked: true },
          $inc: { version: 1 },
        },
      );

      logger.info(
        `Automatic indexing completed: ${result.modifiedCount} catalogs updated.`,
      );

      await this.catalogModel.updateMany(
        { locked: true },
        { $set: { locked: false } },
      );
      logger.info('Unlocked all catalogs after indexing.');
    } catch (error) {
      logger.error('Failed to complete automatic indexing process.');
      throw new BadRequestException(
        'Failed to complete automatic indexing process.',
      );
    }
  }

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
      const locked = await this.lockDocument(id);
      if (!locked) {
        throw new BadRequestException('Catalog is already locked or not found');
      }

      const existingCatalog = await this.catalogModel.findById(id);
      if (!existingCatalog) {
        throw new NotFoundException(`Catalog with ID ${id} not found`);
      }

      if (updateCatalogDto.isPrimary) {
        try {
          await this.handleIsPrimaryUpdate(existingCatalog.vertical);
          logger.info('Catalogs isPrimary updated successfully');
        } catch (error) {
          throw new Error(`Failed to update primary`);
        }
      }

      updateCatalogDto.indexedAt = new Date();

      const updatedCatalog = await this.catalogModel.findOneAndUpdate(
        { _id: id, version: existingCatalog.version },
        { ...updateCatalogDto, $inc: { version: 1 } },
        { new: true },
      );

      if (!updatedCatalog) {
        throw new BadRequestException(
          'Failed to update catalog due to version mismatch',
        );
      }

      logger.info('Catalog updated successfully');
      return updatedCatalog;
    } catch (error) {
      logger.error('Failed to update catalog', error.message);
      throw new BadRequestException(
        'Failed to update catalog: ' + error.message,
      );
    } finally {
      await this.unlockDocument(id);
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

  async unlockDocument(id: string): Promise<void> {
    await this.catalogModel.updateOne(
      { _id: id, locked: true },
      { $set: { locked: false } },
    );
  }

  async lockDocument(id: string): Promise<boolean> {
    const result = await this.catalogModel.findOneAndUpdate(
      { _id: id, locked: { $ne: true } },
      { $set: { locked: true } },
      { new: true },
    );

    return !!result;
  }

  private async handleIsPrimaryUpdate(vertical: string) {
    const documents = await this.catalogModel.find({
      vertical,
      isPrimary: true,
    });

    if (!documents.length) {
      logger.info(`No primary catalogs found for vertical: ${vertical}`);
      return;
    }

    const operations = documents.map((doc) => ({
      updateOne: {
        filter: { _id: doc._id, locked: { $ne: true }, version: doc.version },
        update: {
          $set: { isPrimary: false, indexedAt: new Date(), locked: true },
          $inc: { version: 1 },
        },
      },
    }));

    await performBatchBulkWrite(this.catalogModel, operations);

    const ids = documents.map((doc) => doc._id);
    await this.catalogModel.updateMany(
      { _id: { $in: ids }, locked: true },
      { $set: { locked: false } },
    );

    logger.info(`Updated primary catalogs for vertical: ${vertical}`);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
