import { Injectable, Logger } from '@nestjs/common';
import { ClassConstructor, plainToInstance } from 'class-transformer';

type HttpSuccessStatusType = '200' | '201' | '204';

@Injectable()
export class SuccessResService {
  // Logger
  private readonly logger = new Logger(SuccessResService.name);

  HttpSuccess = (msg: string, status: HttpSuccessStatusType) => {
    return {
      msg,
      status,
    };
  };

  HttpSuccessData = <P>(
    status: HttpSuccessStatusType,
    cls: ClassConstructor<unknown>,
    plain: P,
  ) => {
    let data: unknown;
    try {
      data = plainToInstance(cls, plain);
    } catch (e) {
      this.logger.error(e);
      data = plain;
    }

    return {
      msg: 'success',
      status,
      data,
    };
  };
}
