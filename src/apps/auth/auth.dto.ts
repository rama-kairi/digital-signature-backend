import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty()
  @ApiProperty()
  firstName: string;

  @IsNotEmpty()
  @ApiProperty()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;

  @IsNotEmpty()
  @ApiProperty()
  confirmPassword: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @IsNotEmpty()
  @ApiProperty()
  password: string;
}

export class isValidEmailDto {
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ type: String, description: 'email' })
  email: string;
}
