import { Router } from 'express';
import { getRoomByAnswerId, getMessages, sendMessage, updateMessage, deleteMessage, getMyActiveDiscussions } from './discussion.controller';
import { sendMessageSchema, updateMessageSchema } from './discussion.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/my-active', authenticate, getMyActiveDiscussions);
router.get('/answer/:answerId', getRoomByAnswerId);
router.get('/:roomId/messages', getMessages);
router.post('/messages', authenticate, validate(sendMessageSchema), sendMessage);
router.patch('/messages/:messageId', authenticate, validate(updateMessageSchema), updateMessage);
router.delete('/messages/:messageId', authenticate, deleteMessage);

export default router;
