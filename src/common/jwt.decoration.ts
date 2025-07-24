import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
} from '@nestjs/common';

export const JWT = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const { id_user, id_auth } = request;

    if (id_user && id_auth) {
      return { id_user, id_auth };
    }

    throw new HttpException(
      'The request is forbidden by the server, access credential is not authorized',
      401,
    );
  },
);
