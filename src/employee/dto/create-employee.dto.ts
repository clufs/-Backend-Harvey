import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(4)
  name: string;

  @IsString()
  socket: string;
}
