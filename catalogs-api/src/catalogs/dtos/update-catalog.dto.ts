import {
  IsBoolean,
  IsArray,
  IsOptional,
  IsDate,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';

export class UpdateCatalogDto {
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  locales?: string[];

  @IsOptional()
  @IsDate()
  indexedAt?: Date;
}
