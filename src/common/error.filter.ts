import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { ZodError } from 'zod';

@Catch(ZodError, HttpException)
export class ErrorFilter implements ExceptionFilter {
  private readonly logger = new Logger('ErrorFilter');

  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    if (exception instanceof HttpException) {
      this.logger.error(
        `${exception.getStatus()} - ${JSON.stringify(exception.getResponse())}`,
      );

      response.status(exception.getStatus()).json({
        error: exception.getResponse(),
      });
    } else if (exception instanceof ZodError) {
      this.logger.error(
        `${400} - Validation error: ${JSON.stringify(exception.errors, null, 2)}`,
      );

      response.status(400).json({
        error: 'Validation error',
        details: exception.errors,
      });
    } else {
      this.logger.error(`${500} - ${exception.message}`);

      response.status(500).json({
        error: exception.message,
      });
    }
  }
}
