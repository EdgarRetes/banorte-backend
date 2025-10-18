import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateLayoutValueDto {
  @IsInt()
  @Min(1)
  fileId: number;

  @IsInt()
  @Min(1)
  fieldId: number;

  @IsInt()
  @Min(0)
  row: number;

  @IsString()
  @IsOptional()
  value?: string;
}
