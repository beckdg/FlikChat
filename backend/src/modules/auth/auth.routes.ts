import { Router } from 'express';
import { register, login, logout, getMe } from './auth.controller';
import { registerSchema, loginSchema } from './auth.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, getMe);

export default router;
