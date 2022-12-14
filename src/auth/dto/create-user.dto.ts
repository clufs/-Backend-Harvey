import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';



export class CreateUserDto {

  @ApiProperty({
    description: 'Email del usuario (unique).',
    nullable: false,
    minLength: 1
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Password del usuario.',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  password: string;

  @ApiProperty({
    description: 'Nombre completo del usuario.',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(1)
  fullName: string;

  @ApiProperty({
    description: 'Numero de telefono del usuario',
    nullable: false,
    minLength: 10
  })
  @IsString()
  @MinLength(1)
  phone: string;


  @ApiProperty({
    description: 'Nombre del local/empresa.',
    nullable: false,
    minLength: 1
  })
  @IsString()
  @MinLength(6)
  @MaxLength(30)
  company: string;
}
