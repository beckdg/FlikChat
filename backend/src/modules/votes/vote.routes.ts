import { Router } from 'express';
import { vote, removeVote, getVoteSummary } from './vote.controller';

const router = Router();

router.post('/', vote);
router.delete('/:answerId', removeVote);
router.get('/:answerId/summary', getVoteSummary);

export default router;
