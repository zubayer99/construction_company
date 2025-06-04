import nodemailer from 'nodemailer';
import { config } from '../config/config'; // Removed .js extension
import { logger } from '../utils/logger';   // Removed .js extension

export class EmailService { // Added export keyword
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.password,
      },
    });
  }

  // Ensure this method is public (default)
  async sendEmail(to: string, subject: string, html: string, text?: string) {
    try {
      const mailOptions = {
        from: config.email.from,
        to,
        subject,
        html,
        text: text || this.htmlToText(html), // Added call to htmlToText
      };

      const result = await this.transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully to ${to}`, { messageId: result.messageId });
      return result;
    } catch (error) {
      logger.error(`Failed to send email to ${to}:`, error);
      throw error; // Re-throw the error to be caught by the caller
    }
  }

  // Ensure this method is public (default)
  async sendVerificationEmail(email: string, token: string) {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email/${token}`; // Added fallback for FRONTEND_URL
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Verify Your Email</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; }
          .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #007bff; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Government Procurement System</h1>
          </div>
          <div class="content">
            <h2>Verify Your Email Address</h2>
            <p>Thank you for registering with the Government Procurement System. To complete your registration, please verify your email address by clicking the button below:</p>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
            <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
            <p><a href="${verificationUrl}">${verificationUrl}</a></p>
            <p>This verification link will expire in 24 hours for security reasons.</p>
            <p>If you did not create an account, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the Government Procurement System.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, 'Verify Your Email Address', html);
  }

  // Ensure this method is public (default)
  async sendPasswordResetEmail(email: string, token: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password/${token}`; // Added fallback for FRONTEND_URL
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Reset Your Password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;}
          .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;}
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; background: #dc3545; color: white !important; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <h2>Reset Your Password</h2>
            <p>You (or someone else) requested a password reset for your account. If this was you, click the button below to reset your password:</p>
            <a href="${resetUrl}" class="button">Reset Password</a>
            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p><a href="${resetUrl}">${resetUrl}</a></p>
            <p>This link is valid for 10 minutes. If you didn't request a password reset, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>This is an automated message from the Government Procurement System.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail(email, 'Reset Your Password', html);
  }

  // Added basic htmlToText conversion method
  private htmlToText(html: string): string {
    // A more robust solution might use a library like html-to-text
    return html.replace(/<style([\s\S]*?)<\/style>/gi, '')
               .replace(/<script([\s\S]*?)<\/script>/gi, '')
               .replace(/<\/div>/ig, '\n')
               .replace(/<\/li>/ig, '\n')
               .replace(/<li[^>]*>/ig, '  * ')
               .replace(/<\/ul>/ig, '\n')
               .replace(/<\/p>/ig, '\n')
               .replace(/<br\s*\/?>/gi, "\n")
               .replace(/<[^>]+>/ig, '')
               .replace(/&nbsp;/g, ' ')
               .replace(/&amp;/g, '&')
               .replace(/&quot;/g, '"')
               .replace(/&lt;/g, '<')
               .replace(/&gt;/g, '>')
               .replace(/\n{2,}/g, '\n\n') // Replace multiple newlines with two
               .trim();
  }
}
