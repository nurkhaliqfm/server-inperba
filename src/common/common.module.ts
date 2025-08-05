import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { PrismaService } from './prisma.service';
import { ValidationService } from './validation.service';
import { JWTMiddleware } from './jwt.middleware';
import { JwtModule } from '@nestjs/jwt';
import * as chalk from 'chalk';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot({
      format: winston.format.json(),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format((info) => {
              info.level = info.level.toUpperCase();
              return info;
            })(),
            winston.format.colorize({ all: true }),
            winston.format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
            winston.format.ms(),
            winston.format.printf(
              ({ level, message, timestamp, context, ms }) => {
                return `${chalk.green(`[Nest] ${process.pid}`)}  - ${timestamp}     ${level}${context ? chalk.yellow(` [${context}]`) : chalk.yellow(' [NestApplication]')} ${message}  ${chalk.yellow(ms)}`;
              },
            ),
          ),
        }),
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({}),
  ],
  providers: [PrismaService, ValidationService],
  exports: [PrismaService, ValidationService],
})
export class CommonModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JWTMiddleware).forRoutes('/api/oauth/logout');
    consumer.apply(JWTMiddleware).forRoutes('/api/oauth/refresh');
    consumer.apply(JWTMiddleware).forRoutes('/api/admin/*');
  }
}
