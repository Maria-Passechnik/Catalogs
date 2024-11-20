import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CreateCatalogDto } from './dtos/create-catalog.dto';
import { UpdateCatalogDto } from './dtos/update-catalog.dto';
import { CatalogsService } from './catalogs.service';

@Controller('catalogs')
export class CatalogsController {
  constructor(private readonly catalogsService: CatalogsService) {}

  @Get()
  async getAll(@Query('page') page: number, @Query('limit') limit: number) {
    const pageNumber = page || 1;
    const pageSize = limit || 5;

    if (pageNumber <= 0 || pageSize <= 0) {
      throw new Error('Missing page pagination parameters');
    }

    const catalogs = await this.catalogsService.getAll(pageNumber, pageSize);

    return {
      success: true,
      message: 'Catalogs fetched successfully',
      data: catalogs.data,
      total: catalogs.total,
      page: pageNumber,
      limit: pageSize,
    };
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createCatalogDto: CreateCatalogDto) {
    const newCatalog = await this.catalogsService.create(createCatalogDto);
    return {
      success: true,
      message: 'Catalog created successfully',
      data: newCatalog,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCatalogDto: UpdateCatalogDto,
  ) {
    const updatedCatalog = await this.catalogsService.update(
      id,
      updateCatalogDto,
    );
    return {
      success: true,
      message: 'Catalog updated successfully',
      data: updatedCatalog,
    };
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.catalogsService.delete(id);
    return { success: true, message: 'Catalog deleted successfully' };
  }

  @Delete()
  async deleteBulk(@Query('ids') ids: string) {
    const idArray = ids.split(',');
    await this.catalogsService.deleteBulk(idArray);
    return { success: true, message: 'Catalogs deleted successfully' };
  }
}
