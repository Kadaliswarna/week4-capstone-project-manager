import express from 'express';
import {
  getCards,
  getCardById,
  createCard,
  updateCard,
  deleteCard,
} from '../controllers/cardController.js';
import { protect } from '../middleware/authMiddleware.js';
import commentRouter from './commentRoutes.js';

const router = express.Router({ mergeParams: true });

// Re-route into comment router
router.use('/:cardId/comments', commentRouter);

router.route('/')
  .get(protect, getCards)
  .post(protect, createCard);

router.route('/:id')
  .get(protect, getCardById)
  .put(protect, updateCard)
  .delete(protect, deleteCard);

export default router;
