import { Router } from 'express';
import {
  register,
  login,
  logout,
  getMe,
  verifyEmail,
  resendOtp,
  checkVerificationStatus,
  forgotPassword,
  resetPassword,
  changePassword,
} from './auth.controller';
import {
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/verify-email', validate(verifyEmailSchema), verifyEmail);
router.post('/resend-otp', validate(resendOtpSchema), resendOtp);
router.post('/login', validate(loginSchema), login);
router.post('/forgot-password', validate(forgotPasswordSchema), forgotPassword);
router.post('/reset-password', validate(resetPasswordSchema), resetPassword);
router.post('/change-password', authenticate, validate(changePasswordSchema), changePassword);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);
router.get('/verification-status', checkVerificationStatus);

export default router;
