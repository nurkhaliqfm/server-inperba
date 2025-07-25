import { Injectable, Logger } from '@nestjs/common';
import { BaileysProvider } from '../baileys/baileys.provider';
import { generateOTP } from 'src/utils/otp.util';

@Injectable()
export class OTPService {
  private logger = new Logger(OTPService.name);

  constructor(private readonly wa: BaileysProvider) {}

  async sendOTP(phone: string): Promise<string> {
    const otp = generateOTP();
    const jid = phone.replace(/\D/g, '') + '@s.whatsapp.net';
    const message = `Kode OTP Anda: *${otp}*\nJangan berikan kode ini kepada siapa pun.`;

    await this.wa.getSocket().sendMessage(jid, { text: message });

    this.logger.log(`OTP sent to ${phone}`);
    return otp;
  }
}
