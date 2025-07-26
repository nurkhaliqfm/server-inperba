import { HttpException, Injectable, Logger } from '@nestjs/common';
import { BaileysProvider } from '../baileys/baileys.provider';
import { generateOTP, validateOTP } from 'src/utils/otp.util';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { OTPValidation } from './otp.validation';

@Injectable()
export class OTPService {
  private logger = new Logger(OTPService.name);

  constructor(
    private readonly wa: BaileysProvider,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(phone: string, identity: string): Promise<string> {
    const data = this.validationService.validate(OTPValidation.REQUEST, {
      phone: phone,
      identity: identity,
    });

    const { otp, token } = generateOTP();

    const isPhoneNumberExist =
      await this.prismaService.perkaraBanding.findFirst({
        where: {
          kontak_wa: data.phone,
        },
      });

    if (!isPhoneNumberExist)
      throw new HttpException(
        'This phone number not found on our system records',
        400,
      );

    await this.prismaService.sessionOTP.create({
      data: {
        kontak_wa: data.phone,
        identity: data.identity,
        session: token,
      },
    });

    const jid = data.phone.replace(/\D/g, '') + '@s.whatsapp.net';
    const message = `🔐 OTP VERIFICATION\n\nKode OTP Anda: *${otp}*\n\n> ⁠Jangan bagikan kode ini kepada siapa pun demi keamanan akun Anda.`;

    await this.wa.getSocket().sendMessage(jid, { text: message });

    this.logger.log(`✅ OTP sent to ${data.phone}`);
    return otp;
  }

  async validate(
    phone: string,
    otp: string,
    identity: string,
  ): Promise<string> {
    const data = this.validationService.validate(OTPValidation.VAIDATION, {
      phone: phone,
      otp: otp,
      identity: identity,
    });

    validateOTP({
      otp: data.otp,
      token: data.identity,
    });

    return 'Success';
  }
}
