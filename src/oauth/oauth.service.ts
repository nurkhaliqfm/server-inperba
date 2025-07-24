import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  JWTMiddlewareRequest,
  OauthAuthRequest,
  OauthResponse,
} from 'src/model/oauth.model';
import { Logger } from 'winston';
import { OauthValidation } from './oauth.validation';
import { v4 as uuid } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as crypto from 'crypto';

@Injectable()
export class OauthService {
  private readonly PRIVATEKEY: Buffer;

  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {
    this.PRIVATEKEY = fs.readFileSync(process.env.PRIVATE_KEY_PATH);
  }

  async auth(
    request: OauthAuthRequest,
    authorization: string,
    ip: string,
    useragent: string,
  ): Promise<OauthResponse> {
    this.logger.debug(`New Authentication User ${JSON.stringify(request)}`);

    const token = authorization.split(' ')[1];
    const [id_client, client_secret] = Buffer.from(token, 'base64')
      .toString('utf-8')
      .split(':');

    const oauthRequest = this.validationService.validate(
      OauthValidation.OAUTH,
      {
        ...request,
        id_client: id_client,
        client_secret: client_secret,
        user_agent: useragent,
        ip_address: ip,
      },
    );

    const userData = await this.prismaService.user.findFirst({
      where: {
        username: oauthRequest.username,
        id_role: 1,
      },
      select: {
        id: true,
        fullname: true,
        password: true,
        id_role: true,
      },
    });

    if (!userData) {
      throw new HttpException(
        'These credentials do not match our records.',
        401,
      );
    }

    return bcrypt
      .compare(oauthRequest.password, userData.password)
      .then(async (match) => {
        if (!match) {
          throw new HttpException(
            'These credentials do not match our records.',
            401,
          );
        }

        const authorizationCodes = uuid().toString();
        const accessTokenExpiresAt = 60 * 60 * 1000;
        const refreshTokenExpiresAt = 24 * 30 * 60 * 60 * 1000;
        const salt = crypto.randomBytes(16).toString('hex');
        const clientKey = crypto
          .createHash('sha256')
          .update(oauthRequest.id_client + salt)
          .digest('hex');

        try {
          const createAuthCodes =
            await this.prismaService.oauthAuthorizationCodes.create({
              data: {
                authorization_codes: authorizationCodes,
                id_user: userData.id,
                user_agent: useragent,
                ip_address: ip,
                signature: salt,
                client: clientKey,
              },
              select: {
                id: true,
              },
            });

          const accessToken = this.jwtService.sign(
            {
              payload: Buffer.from(
                `${authorizationCodes}:${userData.id}`,
              ).toString('base64'),
              client: clientKey,
            },
            {
              privateKey: this.PRIVATEKEY,
              expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
              algorithm: 'RS256',
            },
          );

          const refreshToken = this.jwtService.sign(
            {
              payload: crypto
                .createHash('sha256')
                .update(`${authorizationCodes}:${userData.id}`)
                .digest('hex'),
              client: clientKey,
            },
            {
              secret: process.env.JWT_TOKEN_SECRET,
              expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
            },
          );

          await this.prismaService.oauthAccessTokens.create({
            data: {
              access_token: accessToken,
              access_token_expires_at: Date.now() + accessTokenExpiresAt,
              id_auth: createAuthCodes.id,
            },
          });

          await this.prismaService.oauthRefreshTokens.create({
            data: {
              refresh_token: refreshToken,
              refresh_token_expires_at: Date.now() + refreshTokenExpiresAt,
              id_auth: createAuthCodes.id,
            },
          });

          return {
            expires_in: Date.now() + accessTokenExpiresAt,
            access_token: accessToken,
            name: userData.fullname,
            role: 'Admin',
          };
        } catch (error) {
          throw new HttpException(
            `Authentication error : ${JSON.stringify(error)}`,
            401,
          );
        }
      });
  }

  async refresh(jwtRequest: JWTMiddlewareRequest): Promise<OauthResponse> {
    const userCredentials =
      await this.prismaService.oauthAuthorizationCodes.findFirst({
        where: {
          id: jwtRequest.id_auth,
          id_user: jwtRequest.id_user,
        },
        select: {
          id: true,
          id_user: true,
          OauthRefreshTokens: true,
          signature: true,
          authorization_codes: true,
          user: {
            select: {
              fullname: true,
              id_role: true,
            },
          },
        },
      });
    if (userCredentials.user.id_role !== 1)
      throw new HttpException(
        'These credentials do not match our records.',
        401,
      );
    const decoded = this.jwtService.verify(
      userCredentials.OauthRefreshTokens.refresh_token,
      {
        secret: process.env.JWT_TOKEN_SECRET,
      },
    );

    const { payload, client } = decoded;

    const hashedPayload = crypto
      .createHash('sha256')
      .update(
        `${userCredentials.authorization_codes}:${userCredentials.id_user}`,
      )
      .digest('hex');

    const hashedClientId = crypto
      .createHash('sha256')
      .update(process.env.CLIENT_ID + userCredentials.signature)
      .digest('hex');

    if (hashedPayload === payload && hashedClientId === client) {
      const accessTokenExpiresAt = 60 * 60 * 1000;
      const refreshTokenExpiresAt = 24 * 60 * 60 * 30 * 1000;
      const salt = crypto.randomBytes(16).toString('hex');
      const clientKey = crypto
        .createHash('sha256')
        .update(process.env.CLIENT_ID + salt)
        .digest('hex');

      try {
        await this.prismaService.oauthAuthorizationCodes.update({
          where: {
            id: userCredentials.id,
          },
          data: {
            signature: salt,
            client: clientKey,
          },
        });

        const accessToken = this.jwtService.sign(
          {
            payload: Buffer.from(
              `${userCredentials.authorization_codes}:${userCredentials.id_user}`,
            ).toString('base64'),
            client: clientKey,
          },
          {
            privateKey: this.PRIVATEKEY.toString(),
            expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION,
            algorithm: 'RS256',
          },
        );

        const refreshToken = this.jwtService.sign(
          {
            payload: crypto
              .createHash('sha256')
              .update(
                `${userCredentials.authorization_codes}:${userCredentials.id_user}`,
              )
              .digest('hex'),
            client: clientKey,
          },
          {
            secret: process.env.JWT_TOKEN_SECRET,
            expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION,
          },
        );

        await this.prismaService.oauthAccessTokens.update({
          where: {
            id_auth: userCredentials.id,
          },
          data: {
            access_token: accessToken,
            access_token_expires_at: Date.now() + accessTokenExpiresAt,
          },
        });

        await this.prismaService.oauthRefreshTokens.update({
          where: {
            id_auth: userCredentials.id,
          },
          data: {
            refresh_token: refreshToken,
            refresh_token_expires_at: Date.now() + refreshTokenExpiresAt,
          },
        });

        return {
          expires_in: Date.now() + accessTokenExpiresAt,
          access_token: accessToken,
          name: userCredentials.user.fullname,
          role: 'Admin',
        };
      } catch (error) {
        throw new HttpException(
          `Authentication error : ${JSON.stringify(error)}`,
          401,
        );
      }
    } else {
      throw new HttpException(
        'These credentials do not match our records.',
        401,
      );
    }
  }

  async logout(jwtRequest: JWTMiddlewareRequest): Promise<string> {
    this.logger.debug(`User Logout ${JSON.stringify(jwtRequest)}`);

    try {
      await this.prismaService.oauthAuthorizationCodes.delete({
        where: {
          id: jwtRequest.id_auth,
        },
      });
      return 'User logout successfully';
    } catch (error) {
      throw new HttpException(`Logout error : ${JSON.stringify(error)}`, 401);
    }
  }
}
