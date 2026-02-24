const nodemailer = require('nodemailer');

let transporter = null;

const initializeEmailService = () => {
  if (transporter) return transporter;

  const emailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  };

  if (!emailConfig.auth.user || !emailConfig.auth.pass) {
    console.warn('Email service not configured. SMTP credentials missing.');
    return null;
  }

  transporter = nodemailer.createTransport(emailConfig);
  return transporter;
};

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOTPEmail = async (email, otp, purpose = 'registration') => {
  try {
    const emailTransporter = initializeEmailService();
    if (!emailTransporter) {
      throw new Error('Email service not configured');
    }

    const purposeText = {
      registration: 'Verify your email for WorkNest registration',
      login: 'Your WorkNest login verification code',
      password_reset: 'Reset your WorkNest password'
    };

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>WorkNest Verification</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">WorkNest</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">${purposeText[purpose]}</h2>
          <p style="font-size: 16px;">Your verification code is:</p>
          <div style="background: white; border: 2px dashed #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px;">${otp}</span>
          </div>
          <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          <p style="font-size: 14px; color: #666;">If you didn't request this code, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} WorkNest. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"WorkNest" <${process.env.SMTP_USER}>`,
      to: email,
      subject: purposeText[purpose],
      html: htmlContent
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('OTP email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    throw new Error('Failed to send verification email. Please try again.');
  }
};

const sendVerificationEmail = async (email, verificationToken, fullName = '') => {
  try {
    const emailTransporter = initializeEmailService();
    if (!emailTransporter) {
      console.warn('Email service not configured. Verification email not sent.');
      console.log('Verification token for', email, ':', verificationToken);
      return { success: false, message: 'Email service not configured' };
    }

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const verificationUrl = `${clientUrl}/verify-email?token=${verificationToken}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - WorkNest</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="color: white; margin: 0;">WorkNest</h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verify Your Email Address</h2>
          ${fullName ? `<p style="font-size: 16px;">Hi ${fullName},</p>` : '<p style="font-size: 16px;">Hi there,</p>'}
          <p style="font-size: 16px;">Thank you for registering with WorkNest! Please verify your email address to complete your registration.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="display: inline-block; background: #667eea; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
          <p style="font-size: 12px; color: #999; word-break: break-all; background: white; padding: 10px; border-radius: 4px;">${verificationUrl}</p>
          <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
          <p style="font-size: 14px; color: #666;">If you didn't create an account with WorkNest, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">© ${new Date().getFullYear()} WorkNest. All rights reserved.</p>
        </div>
      </body>
      </html>
    `;

    const mailOptions = {
      from: `"WorkNest" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your WorkNest Email Address',
      html: htmlContent
    };

    const info = await emailTransporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending verification email:', error);
    console.log('Verification token for', email, ':', verificationToken);
    return { success: false, error: error.message };
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail,
  sendVerificationEmail,
  initializeEmailService
};
