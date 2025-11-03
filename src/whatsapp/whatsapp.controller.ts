import { Controller, Post, Body } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { BaileysProvider } from 'src/baileys/baileys.provider';

@Controller('/api/admin/whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private readonly baileys: BaileysProvider,
  ) {}

  @Post('connect')
  connect(@Body('phone') phone: string) {
    return this.baileys.start(phone);
  }

  @Post('disconnect')
  disconnect() {
    return this.baileys.logout();
  }

  @Post('/status')
  async status(
    @Body('phone') phone: string,
    @Body('otp') otp: string,
    @Body('identity') identity: string,
  ) {
    const result = await this.whatsappService.validate(phone, otp, identity);
    return result;
  }
}
