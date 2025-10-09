import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateLayoutValueDto {
  @IsInt()
  @IsOptional()
  fileId?: number;

  @IsInt()
  @IsOptional()
  fieldId?: number;

  @IsString()
  @IsOptional()
  value?: string;

  @IsInt()
  @IsOptional()
  row?: number;
}
