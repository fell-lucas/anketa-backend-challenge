import { Injectable, Logger } from '@nestjs/common';
import { EmailTemplate } from '@prisma/client';
import { AwsService } from '../../libraries/aws/aws.service';
import { DbService } from '../../libraries/db/db.service';

export interface EmailTemplateVariables {
  [key: string]: string | number | boolean;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    private readonly dbService: DbService,
    private readonly awsService: AwsService,
  ) {}

  /**
   * Send an email using a template
   */
  async sendEmail(
    templateName: string,
    to: string | string[],
    variables: EmailTemplateVariables = {},
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      // Automatically add appName and appUrl to variables
      const variablesWithAppInfo = {
        ...variables,
        appName: 'Anketa',
        appUrl: 'https://anketa.com',
      };

      // Get the processed template with variables replaced
      const processedTemplate = await this.getProcessedTemplate(
        templateName,
        variablesWithAppInfo,
      );

      if (!processedTemplate) {
        console.log('### email template not found', templateName);
        return {
          success: false,
          error: `Email template '${templateName}' not found or inactive`,
        };
      }

      // Send the email using AWS SES
      const result = await this.awsService.sendEmail(
        to,
        processedTemplate.subject,
        processedTemplate.htmlBody,
        processedTemplate.textBody,
      );

      this.logger.log(
        `Email sent successfully using template '${templateName}'`,
        {
          to: Array.isArray(to) ? to : [to],
          messageId: result.MessageId,
        },
      );

      return {
        success: true,
        messageId: result.MessageId,
      };
    } catch (error) {
      this.logger.error(
        `Failed to send email using template '${templateName}'`,
        error,
      );

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Get an email template by name
   */
  async getTemplate(name: string): Promise<EmailTemplate | null> {
    return await this.dbService.emailTemplate.findUnique({
      where: { name, isActive: true },
    });
  }

  /**
   * Replace variables in template content
   */
  replaceVariables(content: string, variables: EmailTemplateVariables): string {
    let result = content;

    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      result = result.replace(new RegExp(placeholder, 'g'), String(value));
    }

    return result;
  }

  /**
   * Get processed email content with variables replaced
   */
  async getProcessedTemplate(
    name: string,
    variables: EmailTemplateVariables = {},
  ): Promise<{
    subject: string;
    textBody?: string;
    htmlBody?: string;
  } | null> {
    const template = await this.getTemplate(name);

    if (!template) {
      this.logger.warn(`Email template '${name}' not found or inactive`);
      return null;
    }

    return {
      subject: this.replaceVariables(template.subject, variables),
      textBody: template.textBody
        ? this.replaceVariables(template.textBody, variables)
        : undefined,
      htmlBody: template.htmlBody
        ? this.replaceVariables(template.htmlBody, variables)
        : undefined,
    };
  }
}
