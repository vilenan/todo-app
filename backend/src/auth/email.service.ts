import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}

  async sendVerificationEmail(email: string, token: string) {
    const apiKey = this.configService.getOrThrow<string>('RESEND_API_KEY');
    const from = this.configService.get<string>(
      'RESEND_FROM',
      'Todo app <onboarding@resend.dev>',
    );
    const frontendUrl = this.configService
      .get<string>('FRONTEND_URL', 'http://localhost:5173')
      .replace(/\/$/, '');
    const verificationUrl = `${frontendUrl}/verify-email?token=${encodeURIComponent(token)}`;
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [email],
      subject: 'Подтвердите email для Todo app',
      html: `
        <h1>Подтверждение email</h1>
        <p>Перейдите по ссылке, чтобы подтвердить адрес электронной почты:</p>
        <p><a href="${verificationUrl}">Подтвердить email</a></p>
        <p>Ссылка действует 24 часа и может быть использована один раз.</p>
      `,
      text: `Подтвердите email: ${verificationUrl}`,
    });

    if (error) {
      throw new Error(
        `Не удалось отправить письмо подтверждения: ${error.message}`,
      );
    }
  }
}
