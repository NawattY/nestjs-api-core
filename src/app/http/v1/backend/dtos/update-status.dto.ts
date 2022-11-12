import { IsNotEmpty } from 'class-validator';

export class UpdateStatusDto {
  @IsNotEmpty()
  isActive: number;
}
