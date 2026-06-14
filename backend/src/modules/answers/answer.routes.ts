import { Router } from 'express';
import {
  getAnswersByQuestion,
  getAnswerById,
  createAnswer,
  updateAnswer,
  deleteAnswer,
} from './answer.controller';
import { createAnswerSchema, updateAnswerSchema } from './answer.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/question/:questionId', getAnswersByQuestion);
router.get('/:id', getAnswerById);
router.post('/', authenticate, validate(createAnswerSchema), createAnswer);
router.patch('/:id', authenticate, validate(updateAnswerSchema), updateAnswer);
router.delete('/:id', authenticate, deleteAnswer);

export default router;
