import { IsNotEmpty, IsOptional, IsString, IsInt } from 'class-validator';

export class CreateLayoutValueDto {
  @IsInt()
  @IsNotEmpty()
  fileId: number;

  @IsInt()
  @IsNotEmpty()
  fieldId: number;

  @IsString()
  @IsOptional()
  value: string;

  @IsInt()
  @IsNotEmpty()
  row: number;
}
