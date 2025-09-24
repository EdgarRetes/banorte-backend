import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStateDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
