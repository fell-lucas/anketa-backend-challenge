import { SendEmailCommandOutput } from '@aws-sdk/client-ses';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class AwsTestService {
  private logger = new Logger(AwsTestService.name);

  public sentEmails: {
    MessageId: string;
    to: string | string[];
    subject: string;
    htmlBody?: string;
    textBody?: string;
  }[] = [];

  constructor(private readonly configService: AppConfigService) {
    if (!['development', 'test'].includes(process.env.NODE_ENV)) {
      throw new Error('AwsTestService is only available in development');
    }
    this.logger.log('🚧 Simulating AWS');
  }

  async sendSMS(phoneNumber: string, message: string) {
    this.logger.log('SMS sent successfully:', { phoneNumber, message });
    return { MessageId: Math.random().toString(36).substring(2, 15) };
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    htmlBody?: string,
    textBody?: string,
  ): Promise<SendEmailCommandOutput> {
    this.logger.log('Email sent successfully:', {
      to: Array.isArray(to) ? to : [to],
      subject,
      htmlBody,
      textBody,
    });
    const id = Math.random().toString(36).substring(2, 15);
    const email = { to, subject, htmlBody, textBody, MessageId: id };
    this.sentEmails.push(email);
    return { MessageId: id, $metadata: {} };
  }
}
