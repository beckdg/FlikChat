import { Router } from 'express';
import { getProfile, updateProfile, getUserById } from './user.controller';

const router = Router();

router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.get('/:id', getUserById);

export default router;
