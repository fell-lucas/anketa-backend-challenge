import {
  SendEmailCommand,
  SendEmailCommandOutput,
  SESClient,
} from '@aws-sdk/client-ses';
import {
  PublishCommand,
  PublishCommandOutput,
  SNSClient,
} from '@aws-sdk/client-sns';
import { Injectable, Logger } from '@nestjs/common';
import { AppConfigService } from '../config/app.config.service';

@Injectable()
export class AwsService {
  private readonly logger = new Logger(AwsService.name);

  private snsClient: SNSClient;
  private sesClient: SESClient;

  constructor(private readonly configService: AppConfigService) {
    if (!this.configService.awsEnabled) {
      this.logger.warn('AWS is not enabled');
      return;
    }

    const awsConfig = {
      credentials: {
        accessKeyId: this.configService.aws.accessKeyId,
        secretAccessKey: this.configService.aws.secretAccessKey,
      },
      region: this.configService.aws.region,
    };

    this.snsClient = new SNSClient(awsConfig);

    if (this.configService.awsSesEnabled) {
      this.sesClient = new SESClient({
        credentials: {
          accessKeyId: this.configService.aws.sesKey,
          secretAccessKey: this.configService.aws.sesSecret,
        },
        region: this.configService.aws.sesRegion,
      });
    }
  }

  async sendSMS(
    phoneNumber: string,
    message: string,
  ): Promise<PublishCommandOutput> {
    try {
      const result = await this.snsClient.send(
        new PublishCommand({
          Message: message,
          PhoneNumber: phoneNumber,
          ...(this.configService.aws.smsOriginationNumber
            ? {
                MessageAttributes: {
                  'AWS.SNS.SMS.OriginationNumber': {
                    DataType: 'String',
                    StringValue: this.configService.aws.smsOriginationNumber,
                  },
                },
              }
            : {}),
        }),
      );
      this.logger.log('SMS sent successfully:', result);
      return result;
    } catch (error) {
      this.logger.error('Failed to send SMS:', error);
      throw error;
    }
  }

  async sendEmail(
    to: string | string[],
    subject: string,
    htmlBody?: string,
    textBody?: string,
  ): Promise<SendEmailCommandOutput> {
    if (!this.configService.awsSesEnabled) {
      this.logger.warn('🚧 Simulating AWS SES Email', {
        to,
        subject,
        textBody,
      });
      return {
        MessageId: Math.random().toString(36).substring(2, 15),
        $metadata: {},
      };
    }

    if (!this.sesClient) {
      throw new Error('SES client is not initialized');
    }

    try {
      const result = await this.sesClient.send(
        new SendEmailCommand({
          Source: this.configService.aws.sesFromEmail,
          Destination: {
            ToAddresses: Array.isArray(to) ? to : [to],
          },
          Message: {
            Subject: {
              Data: subject,
              Charset: 'UTF-8',
            },
            Body: {
              ...(htmlBody && {
                Html: {
                  Data: htmlBody,
                  Charset: 'UTF-8',
                },
              }),
              ...(textBody && {
                Text: {
                  Data: textBody,
                  Charset: 'UTF-8',
                },
              }),
            },
          },
        }),
      );
      this.logger.log('Email sent successfully:', result);
      return result;
    } catch (error) {
      this.logger.error('Failed to send email:', error);
      throw error;
    }
  }
}
