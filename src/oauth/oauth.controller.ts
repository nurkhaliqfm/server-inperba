import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Ip,
  Post,
} from '@nestjs/common';
import { OauthService } from './oauth.service';
import {
  JWTMiddlewareRequest,
  OauthAuthRequest,
  OauthResponse,
} from 'src/model/oauth.model';
import { JWT } from 'src/common/jwt.decoration';
import { Throttle } from '@nestjs/throttler';

@Controller('/api/oauth')
export class OauthController {
  constructor(private oauthService: OauthService) {}

  @Throttle({
    default: {
      ttl: 60,
      limit: 5,
    },
  })
  @Post('/token')
  @HttpCode(200)
  async auth(
    @Body() request: OauthAuthRequest,
    @Headers('authorization') authorization: string,
    @Headers('user-agent') useragent: string,
    @Ip() ip: string,
  ): Promise<OauthResponse> {
    const result = await this.oauthService.auth(
      request,
      authorization,
      ip,
      useragent,
    );
    return result;
  }

  @Throttle({
    default: {
      ttl: 60,
      limit: 5,
    },
  })
  @Get('/refresh')
  @HttpCode(200)
  async refresh(
    @JWT() jwtRequest: JWTMiddlewareRequest,
  ): Promise<OauthResponse> {
    const result = await this.oauthService.refresh(jwtRequest);
    return result;
  }

  @Throttle({
    default: {
      ttl: 60,
      limit: 5,
    },
  })
  @Get('/logout')
  @HttpCode(200)
  async logout(@JWT() jwtRequest: JWTMiddlewareRequest): Promise<string> {
    const result = await this.oauthService.logout(jwtRequest);
    return result;
  }
}
