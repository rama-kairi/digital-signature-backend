import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ErrorResService } from '@/common/responses/error/error.service';
import { SuccessResService } from '@/common/responses/success/success.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [UserService, ErrorResService, SuccessResService],
  controllers: [UserController],
})
export class UserModule {}
