import { registerAs } from '@nestjs/config';

export default registerAs('nodemailer', () => ({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
}));
