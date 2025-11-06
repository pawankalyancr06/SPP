const nodemailer = require('nodemailer');

// Create and verify transporter with support for production SMTP ONLY
const createTransporter = async () => {
  let transporter;

  if (!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS)) {
    throw new Error('SMTP not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in server/.env');
  }

  // Production provider (e.g. Mailgun/SendGrid/SES via SMTP or your own server)
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.verify();
  return transporter;
};

module.exports = { createTransporter };