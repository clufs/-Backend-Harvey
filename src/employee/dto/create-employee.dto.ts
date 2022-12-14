import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";


export class CreateEmployeeDto {

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(3)
  fullname: string;

  @IsString()
  @MinLength(10)
  phone   : string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  password: string;

}



