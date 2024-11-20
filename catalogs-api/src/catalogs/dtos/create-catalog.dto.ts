import {
  IsString,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  Matches,
} from 'class-validator';

export class CreateCatalogDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[A-Za-z]+$/, { message: 'Name can only contain letters' })
  name: string;

  @IsString()
  @Matches(/^(fashion|home|general)$/, { message: 'Invalid vertical value' })
  vertical: string;

  @IsArray()
  @IsString({ each: true })
  locales: string[];

  @IsBoolean()
  isPrimary: boolean;
}
