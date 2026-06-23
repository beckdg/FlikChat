import { env } from '../config/env';
import { AppError } from '../utils/errors';

interface SendEmailParams {
  to: { email: string; name: string };
  subject: string;
  htmlContent: string;
}

export async function sendEmail({ to, subject, htmlContent }: SendEmailParams) {
  if (!env.brevo.apiKey) {
    console.warn('Brevo API key not configured — skipping email send');
    return;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.brevo.apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sender: {
        name: env.brevo.senderName,
        email: env.brevo.senderEmail,
      },
      to: [to],
      subject,
      htmlContent,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error('Brevo email send failed:', response.status, errorBody);
    throw new AppError(500, 'Failed to send verification email');
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function createPasswordResetEmailHtml(resetLink: string, username: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #6366f1); color: white; font-size: 24px; font-weight: bold; text-align: center;">F</div>
      </div>
      <h2 style="color: #111827; text-align: center; margin-bottom: 8px;">Reset Your Password</h2>
      <p style="color: #6b7280; text-align: center; margin-bottom: 24px;">Hi ${username}, we received a request to reset your password. Click the button below to set a new password.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #7c3aed, #6366f1); color: white; font-size: 16px; font-weight: 600; padding: 14px 36px; border-radius: 12px; text-decoration: none;">Reset Password</a>
      </div>
      <p style="color: #6b7280; text-align: center; font-size: 14px;">This link expires in ${env.passwordResetExpiryMinutes} minutes.</p>
      <p style="color: #9ca3af; text-align: center; font-size: 13px; margin-top: 32px;">If you didn't request a password reset, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">FlikChat — Connect, Share, and Discuss</p>
    </div>
  `;
}

export function createOtpEmailHtml(otp: string, username: string): string {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 48px; height: 48px; line-height: 48px; border-radius: 12px; background: linear-gradient(135deg, #7c3aed, #6366f1); color: white; font-size: 24px; font-weight: bold; text-align: center;">F</div>
      </div>
      <h2 style="color: #111827; text-align: center; margin-bottom: 8px;">Welcome to FlikChat!</h2>
      <p style="color: #6b7280; text-align: center; margin-bottom: 24px;">Hi ${username}, thanks for signing up. Please verify your email address using the code below.</p>
      <div style="text-align: center; margin: 32px 0;">
        <span style="display: inline-block; font-size: 36px; font-weight: 700; letter-spacing: 12px; background: #f3f4f6; padding: 16px 32px; border-radius: 12px; color: #111827;">${otp}</span>
      </div>
      <p style="color: #6b7280; text-align: center; font-size: 14px;">This code expires in ${env.otpExpiryMinutes} minutes.</p>
      <p style="color: #9ca3af; text-align: center; font-size: 13px; margin-top: 32px;">If you didn't create an account, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">FlikChat — Connect, Share, and Discuss</p>
    </div>
  `;
}
