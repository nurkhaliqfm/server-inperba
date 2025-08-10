import { Controller, Post, Body, Get, Req } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { BaileysProvider } from 'src/baileys/baileys.provider';
import { PrismaService } from 'src/common/prisma.service';

@Controller('/api/admin/whatsapp')
export class WhatsappController {
  constructor(
    private readonly whatsappService: WhatsappService,
    private prismaService: PrismaService,
    private readonly baileys: BaileysProvider,
  ) {}

  @Post('connect')
  async connect(@Req() req: any, @Body('phone') phone: string) {
    const { id_user } = req;
    await this.prismaService.user.update({
      where: {
        id: Number(id_user),
      },
      data: {
        is_wa_connected: true,
        kontak: phone,
      },
    });

    return this.baileys.start(phone);
  }

  @Post('disconnect')
  async disconnect(@Req() req: any) {
    const { id_user } = req;

    try {
      await this.baileys.logout(Number(id_user));
    } catch (error) {
      console.log('Error during logout:', error);
    }
    return 'Success';
  }

  @Get('/status')
  async status() {
    return this.baileys.isConnected();
  }
}
