import { Router } from 'express';
import { getRoomByAnswerId, getMessages, sendMessage } from './discussion.controller';
import { sendMessageSchema } from './discussion.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/answer/:answerId', getRoomByAnswerId);
router.get('/:roomId/messages', getMessages);
router.post('/messages', authenticate, validate(sendMessageSchema), sendMessage);

export default router;
