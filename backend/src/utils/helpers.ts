import bcrypt from 'bcryptjs';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateReferenceCode = (prefix: string = 'ELX'): string => {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}${timestamp}${random}`;
};

export const generateUniqueReferralCode = (name: string): string => {
  const cleanName = name.toLowerCase().replace(/[^a-z0-9]/g, '');
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  return `${cleanName}-${randomSuffix}`;
};

export const maskPhoneNumber = (phone: string): string => {
  if (phone.length < 8) return phone;
  const start = phone.slice(0, 3);
  const end = phone.slice(-4);
  const middle = '*'.repeat(phone.length - 7);
  return `${start}${middle}${end}`;
};

export const validateNigerianPhone = (phone: string): boolean => {
  const phoneRegex = /^(\+234|0)[789][01]\d{8}$/;
  return phoneRegex.test(phone);
};

export const validateNIN = (nin: string): boolean => {
  const ninRegex = /^\d{11}$/;
  return ninRegex.test(nin);
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount);
};

export const calculateEarnings = (level: number): number => {
  const payouts = {
    1: parseFloat(process.env.LEVEL_1_PAYOUT || '200'),
    2: parseFloat(process.env.LEVEL_2_PAYOUT || '150'),
    3: parseFloat(process.env.LEVEL_3_PAYOUT || '100'),
    4: parseFloat(process.env.LEVEL_4_PAYOUT || '50'),
    5: parseFloat(process.env.LEVEL_5_PAYOUT || '50')
  };
  
  return payouts[level as keyof typeof payouts] || 0;
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};