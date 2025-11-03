import { Module } from '@nestjs/common';
import { OTPController } from './otp.controller';
import { OTPService } from './otp.service';
import { BaileysProvider } from '../baileys/baileys.provider';

@Module({
  controllers: [OTPController],
  providers: [OTPService, BaileysProvider],
})
export class OTPModule {}
