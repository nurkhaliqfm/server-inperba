import {
  makeWASocket,
  useMultiFileAuthState,
  WASocket,
  DisconnectReason,
} from 'baileys';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import * as fs from 'fs';

@Injectable()
export class BaileysProvider implements OnModuleInit {
  private socket: WASocket;
  private logger = new Logger(BaileysProvider.name);
  private isConnecting = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  async onModuleInit(): Promise<void> {
    await this.start();
  }

  private clearSession(): void {
    try {
      if (fs.existsSync('session')) {
        fs.rmSync('session', { recursive: true, force: true });
        this.logger.log('🗑️ Cleared existing session');
      }
    } catch (error) {
      this.logger.warn('Could not clear session:', error.message);
    }
  }

  private async start(): Promise<void> {
    if (this.isConnecting) {
      this.logger.warn('⚠️ Already attempting to connect, skipping...');
      return;
    }

    try {
      this.isConnecting = true;
      this.logger.log('🚀 Starting WhatsApp connection...');

      const session = await useMultiFileAuthState('session');

      this.socket = makeWASocket({
        auth: session.state,
        printQRInTerminal: false,
        logger: pino({ level: 'silent' }),
        // Add these important options
        generateHighQualityLinkPreview: true,
        syncFullHistory: false,
        markOnlineOnConnect: true,
        // Increase default timeouts
        defaultQueryTimeoutMs: 60000,
        keepAliveIntervalMs: 10000,
      });

      // Save credentials when updated
      this.socket.ev.on('creds.update', session.saveCreds);

      // Handle connection updates with proper reconnection logic
      this.socket.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;

        if (connection) this.logger.log(`🔄 Connection status: ${connection}`);

        if (connection === 'close') {
          this.isConnecting = false;
          const shouldReconnect = this.handleConnectionClose(lastDisconnect);

          if (
            shouldReconnect &&
            this.reconnectAttempts < this.maxReconnectAttempts
          ) {
            this.reconnectAttempts++;
            this.logger.log(
              `🔄 Reconnection attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`,
            );
            setTimeout(() => this.start(), 5000);
          } else if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.logger.error('❌ Max reconnection attempts reached');
          }
        } else if (connection === 'open') {
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          if (this.socket.user) {
            this.logger.log(`✅ Connected as ${this.socket.user.id}`);
            this.logger.log(`📱 Phone: ${this.socket.user.name}`);
          }
        } else if (connection === 'connecting') {
          this.logger.log('🔄 Connecting to WhatsApp...');
        }
      });

      // Generate pairing code only if not already registered
      await this.handleAuthentication();
    } catch (error) {
      this.isConnecting = false;
      this.logger.error('❌ Failed to start:', error.message);
      this.logger.error('Stack trace:', error.stack);
    }
  }

  private handleConnectionClose(lastDisconnect: any): boolean {
    const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;

    this.logger.log(`❌ Connection closed. Reason: ${reason}`);

    switch (reason) {
      case DisconnectReason.badSession:
        this.logger.error(
          '❌ Bad session file, please delete session folder and re-pair',
        );
        this.clearSession();
        return true;

      case DisconnectReason.connectionClosed:
        this.logger.log('🔄 Connection closed, reconnecting...');
        return true;

      case DisconnectReason.connectionLost:
        this.logger.log('🔄 Connection lost, reconnecting...');
        return true;

      case DisconnectReason.connectionReplaced:
        this.logger.error('❌ Connection replaced, another web session opened');
        return false;

      case DisconnectReason.loggedOut:
        this.logger.error('❌ Device logged out, please re-pair');
        this.clearSession();
        return true;

      case DisconnectReason.restartRequired:
        this.logger.log('🔄 Restart required, restarting...');
        return true;

      case DisconnectReason.timedOut:
        this.logger.log('🔄 Connection timed out, reconnecting...');
        return true;

      default:
        this.logger.error(`❌ Unknown disconnect reason: ${reason}`);
        return true;
    }
  }

  private async handleAuthentication(): Promise<void> {
    // Wait a bit for socket to be ready
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Check if already registered
    if (this.socket.authState.creds.registered) {
      this.logger.log('✅ Already registered, waiting for connection...');
      return;
    }

    const phone = process.env.PAIRING_PHONE_NUMBER?.replace(/\D/g, '');

    if (!phone) {
      this.logger.error('❌ PAIRING_PHONE_NUMBER not set in .env file');
      return;
    }

    this.logger.log(`📱 Requesting pairing code for: +${phone}`);

    try {
      // Wait a bit more to ensure socket is ready
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const code = await this.socket.requestPairingCode(phone);

      this.logger.log(`🎉 Pairing code generated successfully!`);
      this.logger.log(`📱 Phone: +${phone}`);
      this.logger.log(`🔑 Code: ${code}`);
      this.logger.log(
        `⏰ Enter this code in your WhatsApp app within 2 minutes`,
      );
    } catch (error) {
      this.logger.error('❌ Failed to generate pairing code:', error.message);

      // If pairing fails, might need to clear session and try again
      if (
        error.message.includes('not authorized') ||
        error.message.includes('403')
      ) {
        this.logger.log('🔄 Clearing session and retrying...');
        this.clearSession();
        setTimeout(() => this.start(), 3000);
      }
    }
  }

  public getSocket(): WASocket {
    if (!this.socket) {
      throw new Error('WhatsApp socket not initialized');
    }
    return this.socket;
  }

  public isConnected(): boolean {
    return this.socket?.user?.id != null;
  }

  async onApplicationShutdown(): Promise<void> {
    if (this.socket) {
      this.logger.log('🔌 Shutting down WhatsApp connection...');
      await this.socket.logout();
    }
  }
}
