import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto, isValidEmailDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Is Valid Email
  @ApiOkResponse({
    status: 200,
    description: 'Valid email address',
    type: Boolean,
  })
  @HttpCode(HttpStatus.OK)
  @Post('/isValidEmail')
  async isValidEmail(@Body() email: isValidEmailDto) {
    return await this.authService.isValidEmail(email);
  }

  // Login User
  @Post('/login')
  @ApiResponse({
    status: 200,
    description: 'Login User',
  })
  @ApiBody({ type: LoginDto })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Register User
  @Post('/register')
  @ApiResponse({
    status: 201,
    description: 'Register User',
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.registerUser(registerDto);
  }
}
