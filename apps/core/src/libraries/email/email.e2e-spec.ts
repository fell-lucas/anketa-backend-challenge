import { TestUtils } from '@repo/system/test/test.utils';
import { AppModule } from '../../app.module';
import { UserSeeds } from '../../iam/user/user.seeds';
import { EmailSeeds } from './email.seeds';
import { EmailService } from './email.service';

describe('EmailService (e2e)', () => {
  const test = new TestUtils(AppModule).withDatabase([UserSeeds, EmailSeeds]);

  describe('sendEmail with USER_SIGNUP template', () => {
    let emailService: EmailService;

    beforeEach(async () => {
      emailService = test.get(EmailService);
    });

    it('should send a welcome email using USER_SIGNUP template', async () => {
      const recipientEmail = 'test@example.com';
      const userName = 'John Doe';

      const result = await emailService.sendEmail(
        'USER_SIGNUP',
        recipientEmail,
        {
          userName,
        },
      );

      // Verify the email was sent successfully
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should send welcome email to multiple recipients', async () => {
      const recipients = ['user1@example.com', 'user2@example.com'];
      const firstName = 'Jane';

      const result = await emailService.sendEmail('USER_SIGNUP', recipients, {
        firstName,
      });

      // Verify the email was sent successfully
      expect(result.success).toBe(true);
      expect(result.messageId).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should return error for non-existent template', async () => {
      const recipientEmail = 'test@example.com';

      const result = await emailService.sendEmail(
        'NON_EXISTENT_TEMPLATE',
        recipientEmail,
        { userName: 'Test User' },
      );

      // Verify the error response
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
      expect(result.error).toContain('not found or inactive');
      expect(result.messageId).toBeUndefined();
    });
  });
});
