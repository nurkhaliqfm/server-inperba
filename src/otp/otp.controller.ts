import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('send')
  async send(@Body('phone') phone: string) {
    if (!phone) return { success: false, message: 'Phone number required' };

    await this.otpService.sendOTP(phone);
    return { success: true, message: 'OTP sent via WhatsApp' };
  }
}
