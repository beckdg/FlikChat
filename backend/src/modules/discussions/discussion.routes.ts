import { Router } from 'express';
import { getRoomByAnswerId, getMessages, sendMessage } from './discussion.controller';

const router = Router();

router.get('/answer/:answerId', getRoomByAnswerId);
router.get('/:roomId/messages', getMessages);
router.post('/messages', sendMessage);

export default router;
