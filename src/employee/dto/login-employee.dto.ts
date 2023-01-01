import { IsString, MinLength, MaxLength } from "class-validator";


export class LoginEmployeeDto{
  
  @IsString()
  // @MinLength(10)
  phone   : string;

  @IsString()
  // @MinLength(6)
  // @MaxLength(50)
  password: string;



}