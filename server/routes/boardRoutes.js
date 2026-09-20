import express from 'express';
import {
  getBoards,
  createBoard,
  updateBoard,
  deleteBoard,
} from '../controllers/boardController.js';
import { protect } from '../middleware/authMiddleware.js';
import listRouter from './listRoutes.js';

const router = express.Router({ mergeParams: true }); // Merge params to get projectId from project routes

// Re-route into list router
router.use('/:boardId/lists', listRouter);

router.route('/')
  .get(protect, getBoards)
  .post(protect, createBoard);

router.route('/:id')
  .put(protect, updateBoard)
  .delete(protect, deleteBoard);

export default router;
