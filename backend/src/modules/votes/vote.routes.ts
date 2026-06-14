import { Router } from 'express';
import { vote, removeVote, getVoteSummary } from './vote.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.post('/', authenticate, vote);
router.delete('/:answerId', authenticate, removeVote);
router.get('/:answerId/summary', getVoteSummary);

export default router;
