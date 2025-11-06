// Authentication controller

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { createTransporter } = require('../utils/emailConfig');

// Transporter will be created lazily
let transporter = null;

async function ensureTransporter() {
  if (!transporter) {
    transporter = await createTransporter();
  }
  return transporter;
}

// Register a new user with email verification
const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    // Debug log (do not log passwords in production)
    console.log('Register attempt:', { name, email, role });
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const rawToken = crypto.randomBytes(32).toString('hex');
    const verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
      isVerified: false,
      verificationToken,
      verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      lastVerificationEmailAt: new Date(),
    });

    // Try to initialize transporter and send verification email
    try {
      await ensureTransporter();

      const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;
      const mailResult = await transporter.sendMail({
        from: process.env.SMTP_FROM || 'no-reply@sportifypro.com',
        to: email,
        subject: 'Verify your SportifyPro account',
        html: `<p>Hi ${name},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
      });

      console.log('✅ Verification email sent to:', email);
      if (process.env.NODE_ENV === 'development') {
        console.log('🔗 Verification URL:', verifyUrl);
      }

      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.verificationToken;
      return res.status(201).json({
        user: userObj,
        message: 'Registration successful. Please check your email to verify your account.',
        previewUrl: mailResult && mailResult.previewUrl,
      });
    } catch (emailErr) {
      console.error('❌ Email sending failed:', emailErr.message);
      console.error('Full error:', emailErr);
      
      // If in development mode and SMTP not configured, auto-verify for testing
      if (process.env.NODE_ENV === 'development' && emailErr.message.includes('SMTP not configured')) {
        console.log('⚠️  DEV MODE: Auto-verifying user since SMTP is not configured');
        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationTokenExpires = undefined;
        await user.save();
        
        const userObj = user.toObject();
        delete userObj.password;
        delete userObj.verificationToken;
        return res.status(201).json({
          user: userObj,
          message: 'Registration successful. (Auto-verified in development mode - SMTP not configured)',
          devMode: true,
        });
      }
      
      const userObj = user.toObject();
      delete userObj.password;
      delete userObj.verificationToken;
      return res.status(201).json({
        user: userObj,
        message: 'Registration completed, but email verification could not be sent. Please check server logs or contact support.',
        error: emailErr.message,
        verificationUrl: process.env.NODE_ENV === 'development' 
          ? `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`
          : undefined,
      });
    }
  } catch (error) {
    console.error('Registration failed:', error);
    return res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token, email } = req.query;
    const hashed = crypto.createHash('sha256').update(token || '').digest('hex');
    const user = await User.findOne({
      email,
      verificationToken: hashed,
      verificationTokenExpires: { $gt: new Date() },
    });
    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification link.' });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();
    return res.status(200).json({ message: 'Email verified successfully. You can now log in.' });
  } catch (error) {
    console.error('Verification failed:', error);
    return res.status(500).json({ message: 'Verification failed', error: error.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    // Check if email is verified
    if (!user.isVerified) {
      // In development mode, auto-verify if SMTP is not configured
      if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
        const smtpConfigured = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
        if (!smtpConfigured) {
          console.log(`⚠️  DEV MODE: Auto-verifying user ${email} on login (SMTP not configured)`);
          user.isVerified = true;
          user.verificationToken = undefined;
          user.verificationTokenExpires = undefined;
          await user.save();
        } else {
          return res.status(403).json({
            message: 'Please verify your email before logging in.',
            code: 'EMAIL_NOT_VERIFIED',
          });
        }
      } else {
        return res.status(403).json({
          message: 'Please verify your email before logging in.',
          code: 'EMAIL_NOT_VERIFIED',
        });
      }
    }
    // Generate JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server misconfiguration: JWT secret is missing.' });
    }
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    // Don't return password
    const userObj = user.toObject();
    delete userObj.password;
    return res.status(200).json({ token, user: userObj });
  } catch (error) {
    console.error('Login failed:', error);
    return res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// Logout (client should just delete token)
const logout = async (req, res) => {
  return res.status(200).json({ message: 'Logged out successfully.' });
};

// Dev mode: Manually verify a user by email (development only)
const devVerifyUser = async (req, res) => {
  try {
    // Only allow in development mode
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ message: 'This endpoint is only available in development mode' });
    }

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.isVerified) {
      return res.status(200).json({ message: 'User is already verified.', user: { email, isVerified: true } });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    console.log(`✅ DEV MODE: Manually verified user ${email}`);
    return res.status(200).json({ message: 'User verified successfully.', user: { email, isVerified: true } });
  } catch (error) {
    console.error('Dev verify failed:', error);
    return res.status(500).json({ message: 'Failed to verify user', error: error.message });
  }
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendVerification,
  devVerifyUser,
};

// Resend verification email
async function resendVerification(req, res) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: 'If an account exists, a new verification email has been sent.' });
    }
    if (user.isVerified) {
      return res.status(200).json({ message: 'Email is already verified. You can log in.' });
    }
    // Throttle resends to once per minute
    const now = new Date();
    if (user.lastVerificationEmailAt && now - user.lastVerificationEmailAt < 60 * 1000) {
      const wait = Math.ceil((60 * 1000 - (now - user.lastVerificationEmailAt)) / 1000);
      return res.status(429).json({ message: `Please wait ${wait}s before requesting again.` });
    }
    // Generate new token and expiry
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.verificationToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    user.lastVerificationEmailAt = now;
    await user.save();

    await ensureTransporter();
    const verifyUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;
    const mailResult = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@sportifypro.com',
      to: email,
      subject: 'Verify your SportifyPro account',
      html: `<p>Please verify your email by clicking the link below:</p><p><a href="${verifyUrl}">${verifyUrl}</a></p>`,
    });

    return res.status(200).json({ message: 'Verification email sent.', previewUrl: mailResult && mailResult.previewUrl });
  } catch (error) {
    console.error('Resend verification failed:', error);
    return res.status(500).json({ message: 'Failed to resend verification email', error: error.message });
  }
}


