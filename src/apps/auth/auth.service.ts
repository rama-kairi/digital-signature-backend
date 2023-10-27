import { ErrorResService } from '@/common/responses/error/error.service';
import { SuccessResService } from '@/common/responses/success/success.service';
import {
  hashPassword,
  validatePassword,
  verifyPassword,
} from '@/common/utils/auth';
import { generateJwt } from '@/common/utils/jwt';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'nestjs-prisma';
import { LoginDto, RegisterDto, isValidEmailDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly error: ErrorResService,
    private readonly success: SuccessResService,
  ) {}
  private readonly logger = new Logger(AuthService.name);

  /* Get User By Email */
  private async getUserByEmail(email: string) {
    try {
      return await this.prisma.user.findFirstOrThrow({
        where: { email },
      });
    } catch (e) {
      this.logger.error(e);
      if (e.code === 'P2025') {
        return this.error.ExcBadRequest('User not found');
      }
      return this.error.ExcBadRequest('Something bad happen, try again.');
    }
  }

  /* Is Valid Email */
  async isValidEmail(email: isValidEmailDto): Promise<boolean> {
    try {
      const user = await this.prisma.user.findFirstOrThrow({
        where: { email: email.email },
      });
      return user && true;
    } catch (e) {
      return this.error.ExcNotFound(
        `User not found with the Email ${email.email}`,
      );
    }
  }

  /* Register User */
  async registerUser(registerDto: RegisterDto) {
    try {
      // Password and Confirm Password must be same
      if (registerDto.password !== registerDto.confirmPassword) {
        return this.error.ExcBadRequest('Password does not match');
      }
      const ps = validatePassword(registerDto.password);
      if (!ps.isOk) {
        return this.error.ExcBadRequest(ps.msg);
      }

      const obj: Prisma.UserCreateInput = {
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        email: registerDto.email,
      };
      const user = await this.prisma.user.create({
        data: { ...obj, password: await hashPassword(registerDto.password) },
      });

      return user;
    } catch (e) {
      this.logger.error(e);
      if (e.code === 'P2002') {
        return this.error.ExcBadRequest('Email already exists');
      }
      return this.error.ExcBadRequest(e.message);
    }
  }

  /* Login */
  async login(loginDto: LoginDto) {
    // Check if there is any user available with this email
    const { email, password } = loginDto;

    const user = await this.getUserByEmail(email);
    if (!user) this.error.ExcUnauthorized('invalid credentials!');

    // Compare Plain and Hash Password
    const isOk = await verifyPassword(user.password, password);
    if (!isOk) this.error.ExcUnauthorized('invalid credentials!');
    const access_token = await generateJwt(user.uuid, 'access');
    const refresh_token = await generateJwt(user.uuid, 'refresh');

    return {
      status: 200,
      access_token,
      refresh_token,
    };
  }
}
