import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { User } from "../database/models/Users";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendEmailNotification = async (userId: string, message: string) => {
  // Fetch user from DB
  const user = await User.findByPk(userId);

  if (!user || !user.email) {
    console.warn(`User not found or missing email for ID: ${userId}`);
    return; // Stop if no valid email
  }

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: user.email,
    subject: "E-commerce Notification",
    text: message
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to: ${user.email}`);
  } catch (error: any) {
    console.error(`Failed to send email to ${user.email}:`, error.message);
  }
};
