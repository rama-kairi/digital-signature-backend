import { Module } from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentController } from './document.controller';
import { JwtModule } from '@nestjs/jwt';
import { ErrorResService } from '@/common/responses/error/error.service';
import { SuccessResService } from '@/common/responses/success/success.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [DocumentService, ErrorResService, SuccessResService],
  controllers: [DocumentController],
})
export class DocumentModule {}
