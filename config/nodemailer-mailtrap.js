import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// For testing with Mailtrap (free testing email service)
// Sign up at: https://mailtrap.io/

const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASSWORD
  }
});

// Send email function
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: 'noreply@yourapp.com',
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending error:', error);
    return false;
  }
};

export default transporter;
