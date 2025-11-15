import nodemailer from "nodemailer";
import { config } from 'dotenv';
config();
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export async function sendEmail(to: string, subject: string, html: string) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
}

export function confirmationTemplate(link: string) {
  return `<h2>Confirm your email</h2>
    <p>Click below to confirm:</p>
    <a href="${link}">${link}</a>`;
}
