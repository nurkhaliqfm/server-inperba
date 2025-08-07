import { Module } from '@nestjs/common';
import { WhatsappController } from './whatsapp.controller';
import { WhatsappService } from './whatsapp.service';
import { BaileysProvider } from '../baileys/baileys.provider';

@Module({
  controllers: [WhatsappController],
  providers: [WhatsappService, BaileysProvider],
})
export class WhatsappModule {}
