import { Router } from 'express';
import multer from 'multer';
import { getProfile, getProfileByUsername, deleteAccount, updateProfile, uploadAvatar, uploadCover } from './user.controller';
import { updateUserSchema } from './user.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.get('/profile', authenticate, getProfile);
router.patch('/profile', authenticate, validate(updateUserSchema), updateProfile);
router.delete('/profile', authenticate, deleteAccount);
router.post('/profile/avatar', authenticate, upload.single('image'), uploadAvatar);
router.post('/profile/cover', authenticate, upload.single('image'), uploadCover);
router.get('/:username', getProfileByUsername);

export default router;
