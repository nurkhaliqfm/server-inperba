import { Controller, Post, Body } from '@nestjs/common';
import { OTPService } from './otp.service';

@Controller('/api/otp')
export class OTPController {
  constructor(private readonly otpService: OTPService) {}

  @Post('/create')
  async send(@Body('phone') phone: string, @Body('identity') identity: string) {
    const result = await this.otpService.create(phone, identity);
    return result;
  }

  @Post('/validate')
  async validate(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
    @Body('identity') identity: string,
  ) {
    const result = await this.otpService.validate(phone, otp, identity);
    return result;
  }
}
