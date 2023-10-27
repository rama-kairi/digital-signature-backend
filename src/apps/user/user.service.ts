import { ErrorResService } from '@/common/responses/error/error.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateUserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly error: ErrorResService,
  ) {}

  // Get All Users
  async getAllUsers() {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  // Create User
  async createUser(data: CreateUserDto) {
    try {
      const user = await this.prisma.user.create({
        data,
      });
      return user;
    } catch (error) {
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }
}
