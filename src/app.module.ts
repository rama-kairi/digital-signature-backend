import { Module } from '@nestjs/common';

import { UserModule } from './apps/user/user.module';
import { DocumentModule } from './apps/document/document.module';
import { AuthModule } from './apps/auth/auth.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [
    PrismaModule.forRoot({
      prismaServiceOptions: {
        middlewares: [
          async (params, next) => {
            const result = await next(params);
            return result;
          },
        ], // see example loggingMiddleware below
        prismaOptions: {
          log: [
            {
              emit: 'event',
              level: 'query',
            },
          ],
        },
      },
      isGlobal: true,
    }),
    AuthModule,
    UserModule,
    DocumentModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
