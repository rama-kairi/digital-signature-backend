import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { SuccessResService } from '@/common/responses/success/success.service';
import { ErrorResService } from '@/common/responses/error/error.service';
import { AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    ErrorResService,
    SuccessResService,
    AtStrategy,
    RtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
