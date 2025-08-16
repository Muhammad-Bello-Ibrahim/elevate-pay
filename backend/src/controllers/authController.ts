import { Request, Response } from 'express';
import { User } from '../models';
import { hashPassword, generateOTP, generateUniqueReferralCode } from '../utils/helpers';
import { generateToken, generateRefreshToken } from '../utils/jwt';
import { 
  signupSchema, 
  loginSchema, 
  otpVerificationSchema, 
  forgotPasswordSchema,
  resetPasswordSchema 
} from '../utils/validation';
import { Op } from 'sequelize';
import logger from '../utils/logger';

// Temporary OTP storage (in production, use Redis)
const otpStore = new Map<string, { otp: string; expires: number; verified: boolean }>();

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error } = signupSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { name, phone, email, nin, password, referralCode } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ phone }, { email }, { nin }]
      }
    });

    if (existingUser) {
      const field = existingUser.phone === phone ? 'phone' : 
                   existingUser.email === email ? 'email' : 'NIN';
      return res.status(409).json({
        success: false,
        message: `User with this ${field} already exists`
      });
    }

    // Verify referral code if provided
    let referrer = null;
    if (referralCode) {
      referrer = await User.findOne({ where: { referral_code: referralCode } });
      if (!referrer) {
        return res.status(400).json({
          success: false,
          message: 'Invalid referral code'
        });
      }
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Generate unique referral code
    const uniqueReferralCode = generateUniqueReferralCode(name);

    // Create user
    const user = await User.create({
      name,
      phone,
      email,
      nin,
      password_hash,
      referral_code: uniqueReferralCode,
      phone_verified: false,
      email_verified: false
    });

    // Generate and send OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(phone, { otp, expires, verified: false });

    // TODO: Send SMS with OTP
    logger.info(`OTP for ${phone}: ${otp}`);

    res.status(201).json({
      success: true,
      message: 'Account created successfully. Please verify your phone number.',
      data: {
        user_id: user.id,
        phone: user.phone,
        referral_code: user.referral_code
      }
    });

  } catch (error) {
    logger.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error } = otpVerificationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { phone, otp } = req.body;

    // Check OTP
    const otpData = otpStore.get(phone);
    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: 'OTP not found or expired'
      });
    }

    if (Date.now() > otpData.expires) {
      otpStore.delete(phone);
      return res.status(400).json({
        success: false,
        message: 'OTP has expired'
      });
    }

    if (otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP'
      });
    }

    // Update user verification status
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({ 
      phone_verified: true,
      last_login: new Date()
    });

    // Mark OTP as verified
    otpStore.set(phone, { ...otpData, verified: true });

    // Generate tokens
    const token = generateToken({ id: user.id, phone: user.phone });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(200).json({
      success: true,
      message: 'Phone number verified successfully',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { phone, password } = req.body;

    // Find user
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if phone is verified
    if (!user.phone_verified) {
      return res.status(403).json({
        success: false,
        message: 'Please verify your phone number first'
      });
    }

    // Update last login
    await user.update({ last_login: new Date() });

    // Generate tokens
    const token = generateToken({ id: user.id, phone: user.phone });
    const refreshToken = generateRefreshToken({ id: user.id });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token,
        refreshToken
      }
    });

  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error } = forgotPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { phone } = req.body;

    // Find user
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(phone, { otp, expires, verified: false });

    // TODO: Send SMS with OTP
    logger.info(`Password reset OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'Password reset OTP sent to your phone number'
    });

  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    // Validate input
    const { error } = resetPasswordSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

    const { phone, otp, newPassword } = req.body;

    // Check OTP
    const otpData = otpStore.get(phone);
    if (!otpData || Date.now() > otpData.expires || otpData.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP'
      });
    }

    // Find user
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password
    const password_hash = await hashPassword(newPassword);
    await user.update({ password_hash });

    // Remove OTP
    otpStore.delete(phone);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    // In a real implementation, you would invalidate the token
    // For now, we'll just send a success response
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    logger.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

export const resendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;

    // Find user
    const user = await User.findOne({ where: { phone } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Generate and send OTP
    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(phone, { otp, expires, verified: false });

    // TODO: Send SMS with OTP
    logger.info(`Resent OTP for ${phone}: ${otp}`);

    res.status(200).json({
      success: true,
      message: 'OTP resent successfully'
    });

  } catch (error) {
    logger.error('Resend OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};