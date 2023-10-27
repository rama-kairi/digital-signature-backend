import { Global, Module } from '@nestjs/common';
import { ErrorResService } from './error.service';

@Global()
@Module({
  imports: [],
  providers: [ErrorResService],
  exports: [ErrorResService],
})
export class ErrorResModule {}
