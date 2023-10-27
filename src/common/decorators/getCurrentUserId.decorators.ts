import { createParamDecorator, ExecutionContext, Logger } from '@nestjs/common';
import { JwtPayload } from 'apps/auth/types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    try {
      const request = context.switchToHttp().getRequest();
      const user = request.user as JwtPayload;
      return user.sub;
    } catch (error) {
      Logger.error(error);
      return null;
    }
  },
);
