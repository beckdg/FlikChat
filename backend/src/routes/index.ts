import { Router } from 'express';
import { healthCheck } from '../controllers/health.controller';
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/users/user.routes';
import questionRoutes from '../modules/questions/question.routes';
import answerRoutes from '../modules/answers/answer.routes';
import discussionRoutes from '../modules/discussions/discussion.routes';
import voteRoutes from '../modules/votes/vote.routes';
import notificationRoutes from '../modules/notifications/notification.routes';

const router = Router();

router.get('/health', healthCheck);
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/questions', questionRoutes);
router.use('/answers', answerRoutes);
router.use('/discussions', discussionRoutes);
router.use('/votes', voteRoutes);
router.use('/notifications', notificationRoutes);

export default router;
