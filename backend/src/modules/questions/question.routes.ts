import { Router } from 'express';
import {
  getQuestions,
  getTrendingQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  likeQuestion,
} from './question.controller';
import { createQuestionSchema, updateQuestionSchema } from './question.validator';
import { validate } from '../../middleware/validate';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

router.get('/', getQuestions);
router.get('/trending', getTrendingQuestions);
router.get('/:id', getQuestionById);
router.post('/', authenticate, validate(createQuestionSchema), createQuestion);
router.patch('/:id', authenticate, validate(updateQuestionSchema), updateQuestion);
router.delete('/:id', authenticate, deleteQuestion);
router.post('/:id/like', authenticate, likeQuestion);

export default router;
