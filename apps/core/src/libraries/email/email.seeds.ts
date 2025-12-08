import { Injectable } from '@nestjs/common';
import { Seeds } from '@repo/system/test/seeds.interface';
import { DbService } from '../../libraries/db/db.service';

@Injectable()
export class EmailSeeds implements Seeds {
  constructor(private db: DbService) {}

  async seed(): Promise<void> {
    await this.createEmailTemplates();
  }

  async createEmailTemplates() {
    // USER_SIGNUP template
    await this.db.emailTemplate.upsert({
      where: { name: 'USER_SIGNUP' },
      update: {},
      create: {
        name: 'USER_SIGNUP',
        subject: "Welcome to Anketa - Glad You're Here",
        textBody: `Hi{{ firstName}},

We're excited to welcome you to Anketa, the social polling app where the world votes! Anketa is a place for all opinions. Whether you're here to vote, create, or just explore, you've joined a community that values truth, curiosity, and expression. No filters. Built on Blockchain. No noise. Just people speaking up—like you.

Anketa stands for transparency, freedom of speech, and democracy. We operate on the fundamental principles of upholding freedom of speech and ensuring every opinion is heard, fostering an environment of open dialogue and diverse perspectives. Anketa was created to prioritize transparency and credibility, promoting informed understanding through unbiased polling and ultimately building a foundation of trust within every community.

Anketa is all about:
- Blockchain-driven transparency
- Real people, real opinions
- Understanding your customers
- Insights for governments/businesses
- Tools for poll/survey creation and analytics

Now you can start a poll that sparks conversation. See real-time results. Know exactly what your friends, community, or customers think in any situation.

Thanks for joining our growing community!
— The Anketa Team`,
        htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Anketa</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .button {
            display: inline-block;
            background-color: #4f46e5;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Welcome to <strong>Anketa</strong> - Glad You're Here</h1>
    </div>
    <div class="content">
        <h2>Hi{{ firstName}},</h2>
        <p>We're excited to welcome you to <strong>Anketa</strong>, the social polling app where the world votes! <strong>Anketa</strong> is a place for all opinions. Whether you're here to vote, create, or just explore, you've joined a community that values truth, curiosity, and expression. No filters. Built on Blockchain. No noise. Just people speaking up—like you.</p>
        <p><strong>Anketa</strong> stands for transparency, freedom of speech, and democracy. We operate on the fundamental principles of upholding freedom of speech and ensuring every opinion is heard, fostering an environment of open dialogue and diverse perspectives. <strong>Anketa</strong> was created to prioritize transparency and credibility, promoting informed understanding through unbiased polling and ultimately building a foundation of trust within every community.</p>
        <p><strong>Anketa</strong> is all about:</p>
        <ul>
            <li>Blockchain-driven transparency</li>
            <li>Real people, real opinions</li>
            <li>Understanding your customers</li>
            <li>Insights for governments/businesses</li>
            <li>Tools for poll/survey creation and analytics</li>
        </ul>
        <p>Now you can start a poll that sparks conversation. See real-time results. Know exactly what your friends, community, or customers think in any situation.</p>
        <p>Thanks for joining our growing community!<br>— The <strong>Anketa</strong> Team</p>
    </div>
</body>
</html>`,
        variables: ['firstName'],
        description:
          'Welcome email sent to new users after successful account creation',
        isActive: true,
      },
    });

    await this.db.emailTemplate.upsert({
      where: { name: 'USER_DELETED' },
      update: {},
      create: {
        name: 'USER_DELETED',
        subject: 'Your account has been deleted',
        textBody: `Dear {{ firstName}},

We confirm that your account with Anketa has been successfully deleted as per your request. You will no longer receive any communications from us.

We’re sorry to see you go and would be happy to welcome you back anytime. If you have any feedback on how we could have improved your experience, please feel free to share it at support@nketa.com. Your insights are valuable to us.

Thank you for having been a part of our community. 

Anketa Team
`,
        htmlBody: `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Your account has been deleted</title>
        </head>
        <body>
    <div class="header">
        <h1>Your account has been deleted</h1>
    </div>
    <div class="content">
        <h2>Dear {{ firstName}},</h2>
        <p>We confirm that your account with <strong>Anketa</strong> has been successfully deleted as per your request. You will no longer receive any communications from us.</p>
        <p>We’re sorry to see you go and would be happy to welcome you back anytime. If you have any feedback on how we could have improved your experience, please feel free to share it at <a href="mailto:support@nketa.com">support@nketa.com</a>. Your insights are valuable to us.</p>
        <p>Thank you for having been a part of our community.</p>
        <p><strong>Anketa Team</strong></p>
    </div>
</body>
</html>
        </html>`,
        variables: ['firstName'],
        description: 'Notification sent when a user deletes their account',
        isActive: true,
      },
    });

    await this.db.emailTemplate.upsert({
      where: { name: 'POST_BLOCKCHAIN_ERROR' },
      update: {},
      create: {
        name: 'POST_BLOCKCHAIN_ERROR',
        subject: 'Post blockchain transaction failed',
        textBody: `Dear {{ firstName }},

Your post is not visible to anyone due to a blockchain transaction failure. Please, retry to complete the blockchain transaction. 

Details: {{ details }}

Best regards,

Anketa`,
        htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Post blockchain transaction failed</title>
</head>
<body>
    <p>Dear {{ firstName }},</p>
    <p>Your post is not visible to anyone due to a blockchain transaction failure. Please, retry to complete the blockchain transaction.</p>
    <p><strong>Details:</strong> {{ details }}</p>
    <p>Best regards,</p>
    <p>Anketa</p>
</body>
</html>`,
        variables: ['firstName', 'details'],
        description:
          'Notification sent when a post fails to become visible because of a blockchain transaction error',
        isActive: true,
      },
    });

    await this.db.emailTemplate.upsert({
      where: { name: 'REPORT_RECEIVED' },
      update: {},
      create: {
        name: 'REPORT_RECEIVED',
        subject: 'We Received Your Report',
        textBody: `Hi {{userName}},

Thank you for helping us maintain a safe and friendly environment. We are currently reviewing your report and will take appropriate action shortly.

Details: {{reportId}}

{{reportDetails}}
Best regards,
The Anketa Team`,
        htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>We Received Your Report</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .details {
            background-color: #eef2ff;
            border-left: 4px solid #4f46e5;
            padding: 16px;
            margin: 24px 0;
            border-radius: 6px;
            word-break: break-word;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>We Received Your Report</h1>
    </div>
    <div class="content">
        <p>Hi <strong>{{userName}}</strong>,</p>
        <p>Thank you for helping us maintain a safe and friendly environment. We are currently reviewing your report and will take appropriate action shortly.</p>
        <div class="details">
            <p><strong>Report ID:</strong> {{reportId}}</p>
            <p>{{reportDetails}}</p>
        </div>
        <p>Best regards,<br><strong>The Anketa Team</strong></p>
    </div>
</body>
</html>`,
        variables: ['userName', 'reportId', 'reportDetails'],
        description: 'Acknowledgement email sent when a user submits a report',
        isActive: true,
      },
    });

    await this.db.emailTemplate.upsert({
      where: { name: 'TOKEN_MINTING_WINNER' },
      update: {},
      create: {
        name: 'TOKEN_MINTING_WINNER',
        subject: 'PPT Tokens Received!',
        textBody: `{{ tokensAdded }} token/s received

Congratulations! You've earned {{ tokensAdded }} token/s for your participation on Anketa which have been added to your wallet. Stay active to earn even more!

Best regards,

Anketa Team
`,
        htmlBody: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PPT Tokens Received!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .footer {
            text-align: center;
            margin-top: 20px;
            color: #6b7280;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>{{ tokensAdded }} Token/s Received</h1>
    </div>
    <div class="content">
        <p>Congratulations! You've earned <strong>{{ tokensAdded }}</strong> token/s for your participation on <strong>Anketa</strong> which have been added to your wallet. Stay active to earn even more!</p>
        <p>Best regards,<br><strong>Anketa Team</strong></p>
    </div>
    <div class="footer">
        <p>PPT Tokens Received!</p>
    </div>
</body>
</html>`,
        variables: ['tokensAdded'],
        description:
          'Notification sent when users receive PPT tokens credited to their wallet',
        isActive: true,
      },
    });
  }

  /**
   * Create a custom email template
   */
  async createTemplate(data: {
    name: string;
    subject: string;
    textBody?: string;
    htmlBody?: string;
    variables?: string[];
    description?: string;
  }) {
    return await this.db.emailTemplate.upsert({
      where: { name: data.name },
      update: data,
      create: {
        ...data,
        variables: data.variables || [],
        isActive: true,
      },
    });
  }
}
