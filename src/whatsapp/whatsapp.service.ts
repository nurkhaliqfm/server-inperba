import { HttpException, Injectable } from '@nestjs/common';
import { BaileysProvider } from '../baileys/baileys.provider';
import { generateOTP, validateOTP } from 'src/utils/otp.util';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import { WhatsappValidation } from './whatsapp.validation';

@Injectable()
export class WhatsappService {
  constructor(
    private readonly baileys: BaileysProvider,
    private prismaService: PrismaService,
    private validationService: ValidationService,
  ) {}

  async create(phone: string, identity: string): Promise<string> {
    const data = this.validationService.validate(WhatsappValidation.REQUEST, {
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
    const socket = await this.baileys.getSocket();

    await socket.sendMessage(jid, { text: message });

    return `✅ OTP sent to ${data.phone}`;
  }

  async validate(
    phone: string,
    otp: string,
    identity: string,
  ): Promise<string> {
    const data = this.validationService.validate(WhatsappValidation.REQUEST, {
      phone: phone,
      otp: otp,
      identity: identity,
    });

    const phoneNumberHasSession = await this.prismaService.sessionOTP.findFirst(
      {
        where: {
          kontak_wa: data.phone,
          identity: data.identity,
        },
      },
    );

    if (!phoneNumberHasSession)
      throw new HttpException(
        'This phone number otp session not found on our system records',
        400,
      );

    const isValidOTP = validateOTP({
      otp: data.otp,
      token: phoneNumberHasSession.session,
    });

    if (!isValidOTP) throw new HttpException('OTP number is invalid', 400);

    await this.prismaService.sessionOTP.update({
      where: { id: phoneNumberHasSession.id },
      data: {
        isValidate: true,
      },
    });

    return `✅ OTP success to validate ${data.phone}`;
  }
}
