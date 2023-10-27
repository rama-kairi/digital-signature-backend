import { JwtAuthGuard } from '@/common/guards';
import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@ApiSecurity('JWT_auth')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'User' })
  @ApiOperation({ summary: 'Get User' })
  async getAllUsers() {
    const data = await this.userService.getAllUsers();
    return data;
  }
}
