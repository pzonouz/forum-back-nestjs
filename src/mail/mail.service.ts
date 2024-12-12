import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  public sendMail(to: string, subject: string, text: string, html: string) {
    return this.mailerService.sendMail({
      to: to,
      from: 'noreply@automobileforum.ir',
      subject: subject,
      text: text,
      html: html,
    });
  }
}
