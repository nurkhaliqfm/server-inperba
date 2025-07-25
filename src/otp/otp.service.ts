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
    const message = `🔐 OTP VERIFICATION\n\nKode OTP Anda: *${otp}*\n\n⁠Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda`;

    await this.wa.getSocket().sendMessage(jid, { text: message });

    this.logger.log(`OTP sent to ${phone}`);
    return otp;
  }
}
