import express from 'express';
import {
  getLists,
  createList,
  updateList,
  deleteList,
} from '../controllers/listController.js';
import { protect } from '../middleware/authMiddleware.js';
import cardRouter from './cardRoutes.js';

const router = express.Router({ mergeParams: true });

// Re-route into card router
router.use('/:listId/cards', cardRouter);

router.route('/')
  .get(protect, getLists)
  .post(protect, createList);

router.route('/:id')
  .put(protect, updateList)
  .delete(protect, deleteList);

export default router;
