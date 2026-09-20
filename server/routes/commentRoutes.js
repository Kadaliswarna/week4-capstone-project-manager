import express from 'express';
import {
  getComments,
  addComment,
  deleteComment,
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(protect, getComments)
  .post(protect, addComment);

router.route('/:id')
  .delete(protect, deleteComment);

export default router;
