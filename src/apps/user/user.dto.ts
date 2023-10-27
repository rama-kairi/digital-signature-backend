import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
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
