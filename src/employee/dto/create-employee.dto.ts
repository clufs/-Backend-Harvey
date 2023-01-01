import { IsEmail, isString, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  @MinLength(4)
  name: string;

  // @IsString()
  // socket: string;

  @IsString()
  @MinLength(4)
  phone: string;

  @IsString()
  @MinLength(4)
  password: string;

}
