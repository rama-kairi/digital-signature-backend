import { Global, Module } from '@nestjs/common';
import { SuccessResService } from './success.service';

@Global()
@Module({
  imports: [],
  providers: [SuccessResService],
  exports: [SuccessResService],
})
export class SuccessResModule {}
