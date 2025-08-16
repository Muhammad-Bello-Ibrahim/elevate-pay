import Joi from 'joi';

export const signupSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .required()
    .messages({
      'string.pattern.base': 'Name should only contain letters and spaces',
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters'
    }),
  
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid Nigerian phone number'
    }),
  
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Please enter a valid email address'
    }),
  
  nin: Joi.string()
    .pattern(/^\d{11}$/)
    .required()
    .messages({
      'string.pattern.base': 'NIN must be exactly 11 digits'
    }),
  
  password: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters long',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }),
  
  referralCode: Joi.string()
    .optional()
    .allow('')
});

export const loginSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required()
    .messages({
      'string.pattern.base': 'Please enter a valid Nigerian phone number'
    }),
  
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Password is required'
    })
});

export const otpVerificationSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required(),
  
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      'string.pattern.base': 'OTP must be exactly 6 digits'
    })
});

export const forgotPasswordSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required()
});

export const resetPasswordSchema = Joi.object({
  phone: Joi.string()
    .pattern(/^(\+234|0)[789][01]\d{8}$/)
    .required(),
  
  otp: Joi.string()
    .pattern(/^\d{6}$/)
    .required(),
  
  newPassword: Joi.string()
    .min(8)
    .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .required()
});

export const updateProfileSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-Z\s]+$/)
    .optional(),
  
  email: Joi.string()
    .email()
    .optional(),
  
  profile_pic: Joi.string()
    .uri()
    .optional()
});

export const fundWalletSchema = Joi.object({
  amount: Joi.number()
    .min(100)
    .max(1000000)
    .required()
    .messages({
      'number.min': 'Minimum funding amount is ₦100',
      'number.max': 'Maximum funding amount is ₦1,000,000'
    }),
  
  payment_method: Joi.string()
    .valid('paystack', 'flutterwave')
    .required()
});

export const withdrawalSchema = Joi.object({
  amount: Joi.number()
    .min(1000)
    .required()
    .messages({
      'number.min': 'Minimum withdrawal amount is ₦1,000'
    }),
  
  bank_code: Joi.string()
    .required(),
  
  account_number: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      'string.pattern.base': 'Account number must be exactly 10 digits'
    }),
  
  account_name: Joi.string()
    .required()
});