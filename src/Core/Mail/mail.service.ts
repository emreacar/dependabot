import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { SendMailParams } from './types/send-mail.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async send(params: SendMailParams): Promise<void> {
    try {
      await this.mailerService.sendMail({
        to: params.to,
        subject: params.subject,
        template: params.template,
        context: {
          ...params.context,
        },
      });
    } catch (e) {
      console.log(e.message);
    }
  }
}
