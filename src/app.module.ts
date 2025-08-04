import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { OauthModule } from './oauth/oauth.module';
import { PublicModule } from './public/public.module';
import { JWTMiddleware } from './common/jwt.middleware';
import { CacheControlMiddleware } from './common/cache-control.middleware';
import { JwtModule } from '@nestjs/jwt';
import * as fs from 'fs';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { OTPModule } from './otp/otp.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      privateKey: fs.readFileSync(process.env.PRIVATE_KEY_PATH),
      publicKey: fs.readFileSync(process.env.PUBLIC_KEY_PATH),
      signOptions: { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION },
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ name: 'default', ttl: 60, limit: 20 }],
    }),
    CommonModule,
    OauthModule,
    PublicModule,
    AdminModule,
    OTPModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CacheControlMiddleware).forRoutes('*');
    consumer
      .apply(JWTMiddleware)
      .exclude(
        { path: 'api/oauth/token', method: RequestMethod.POST },
        { path: 'api/public/*', method: RequestMethod.GET },
      );
    // .forRoutes({ path: 'api/admin/*', method: RequestMethod.ALL });
  }
}
