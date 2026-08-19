import nodemailer from 'nodemailer';
import { env } from '../config/env.config';
import {
  getWelcomeEmailTemplate,
  getPaymentPendingTemplate,
  getPaymentApprovedTemplate,
  getPostPublishedTemplate
} from '../templates/email.templates';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_PORT === 465,
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });
  }

  private async sendHtmlEmail(to: string, subject: string, html: string) {
    // If SMTP_PASS is empty (local dev), just log the email and return
    if (!env.SMTP_PASS) {
      console.log(`[EmailService - MOCK] Sending email to ${to}`);
      console.log(`[EmailService - MOCK] Subject: ${subject}`);
      return;
    }

    try {
      const info = await this.transporter.sendMail({
        from: env.EMAIL_FROM,
        to,
        subject,
        html,
      });
      console.log(`[EmailService] Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
      console.error(`[EmailService] Failed to send email to ${to}:`, error);
    }
  }

  public async sendWelcomeEmail(to: string, name: string) {
    const html = getWelcomeEmailTemplate(name, env.CLIENT_URL);
    await this.sendHtmlEmail(to, 'Welcome to Evolvix AI!', html);
  }

  public async sendPaymentPendingEmail(to: string) {
    const html = getPaymentPendingTemplate(env.CLIENT_URL);
    await this.sendHtmlEmail(to, 'We received your payment screenshot', html);
  }

  public async sendPaymentApprovedEmail(to: string, plan: string) {
    const html = getPaymentApprovedTemplate(env.CLIENT_URL, plan);
    await this.sendHtmlEmail(to, 'Your payment was approved!', html);
  }

  public async sendPostPublishedEmail(to: string, platform: string, postUrl?: string) {
    const html = getPostPublishedTemplate(platform, postUrl);
    await this.sendHtmlEmail(to, `Your post is live on ${platform}!`, html);
  }
}

export const emailService = new EmailService();
