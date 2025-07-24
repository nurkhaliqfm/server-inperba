import { HttpException, Injectable, NestMiddleware } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { JsonWebTokenError, JwtService } from '@nestjs/jwt';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  private readonly PUBLICKEY: Buffer;

  constructor(
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.PUBLICKEY = fs.readFileSync(process.env.PUBLIC_KEY_PATH);
  }

  async use(req: any, res: any, next: (error?: Error | any) => void) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    const routePath = req.originalUrl;

    if (!authHeader?.startsWith('Bearer '))
      throw new HttpException(
        'You are not allowed to access this resource.',
        404,
      );

    const authToken = authHeader.split(' ')[1];
    const tokenType =
      routePath === '/api/oauth/refresh'
        ? 'OauthRefreshTokens'
        : 'OauthAccessTokens';
    const expirationField =
      routePath === '/api/oauth/refresh'
        ? 'refresh_token_expires_at'
        : 'access_token_expires_at';

    try {
      const decoded =
        tokenType === 'OauthRefreshTokens'
          ? this.jwtService.decode(authToken)
          : this.jwtService.verify(authToken, {
              publicKey: this.PUBLICKEY.toString(),
              algorithms: ['RS256'],
            });

      const { payload, client } = decoded;

      const [authorizationCode, userId] = Buffer.from(payload, 'base64')
        .toString('utf-8')
        .split(':');

      const getAuthCredentials =
        await this.prismaService.oauthAuthorizationCodes.findFirst({
          where: {
            authorization_codes: authorizationCode,
            client: client,
            id_user: Number(userId),
            user: {
              id_role: 1,
            },
          },
          select: {
            id: true,
            OauthAccessTokens: true,
            OauthRefreshTokens: true,
            signature: true,
          },
        });

      if (!getAuthCredentials)
        throw new HttpException(
          'You are not allowed to access this resource.',
          404,
        );

      const hashedClientId = crypto
        .createHash('sha256')
        .update(process.env.CLIENT_ID + getAuthCredentials.signature)
        .digest('hex');

      const tokenExpirationTime =
        getAuthCredentials[tokenType]?.[expirationField];

      if (Date.now() < tokenExpirationTime && hashedClientId === client) {
        const isRefressToken =
          getAuthCredentials.OauthRefreshTokens.refresh_token !== null
            ? true
            : false;

        const isAccessToken =
          getAuthCredentials.OauthAccessTokens.access_token !== null &&
          getAuthCredentials.OauthAccessTokens.access_token === authToken
            ? true
            : false;

        if (isRefressToken && isAccessToken) {
          req.id_user = Number(userId);
          req.id_auth = Number(getAuthCredentials.id);
        }
      }

      next();
    } catch (error) {
      const err: JsonWebTokenError = error as JsonWebTokenError;
      throw new HttpException(`${err.name}: ${err.message}`, 404);
    }
  }
}
