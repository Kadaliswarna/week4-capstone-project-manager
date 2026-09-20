import Comment from '../models/Comment.js';
import Card from '../models/Card.js';
import List from '../models/List.js';
import Project from '../models/Project.js';

// Helper to check access
const checkAccess = async (cardId, userId, userRole) => {
  const card = await Card.findById(cardId).populate({
    path: 'list',
    populate: { path: 'board' },
  });
  if (!card) throw new Error('Card not found');
  
  const project = await Project.findById(card.list.board.project);
  if (
    userRole !== 'admin' &&
    project.owner.toString() !== userId.toString() &&
    !project.members.includes(userId)
  ) {
    throw new Error('Not authorized');
  }
  return true;
};

// @desc    Get comments for a card
// @route   GET /api/cards/:cardId/comments
// @access  Private
export const getComments = async (req, res) => {
  try {
    await checkAccess(req.params.cardId, req.user._id, req.user.role);
    const comments = await Comment.find({ card: req.params.cardId })
      .populate('user', 'name avatar')
      .sort('-createdAt'); // Newest first
    res.json(comments);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Add a comment
// @route   POST /api/cards/:cardId/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    await checkAccess(req.params.cardId, req.user._id, req.user.role);
    
    const { text } = req.body;

    const comment = new Comment({
      card: req.params.cardId,
      user: req.user._id,
      text,
    });

    const createdComment = await comment.save();
    await createdComment.populate('user', 'name avatar');
    
    res.status(201).json(createdComment);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });
    
    await checkAccess(comment.card, req.user._id, req.user.role);

    // Only the comment author or an admin can delete it
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.deleteOne();
    res.json({ message: 'Comment removed' });
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};
