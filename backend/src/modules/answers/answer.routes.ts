import { Router } from 'express';
import {
  getAnswersByQuestion,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from './answer.controller';

const router = Router();

router.get('/question/:questionId', getAnswersByQuestion);
router.get('/:id', getAnswerById);
router.post('/', createAnswer);
router.patch('/:id', updateAnswer);
router.delete('/:id', deleteAnswer);

export default router;
