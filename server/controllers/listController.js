import List from '../models/List.js';
import Board from '../models/Board.js';
import Project from '../models/Project.js';

// Helper to check access
const checkAccess = async (boardId, userId, userRole) => {
  const board = await Board.findById(boardId);
  if (!board) throw new Error('Board not found');
  
  const project = await Project.findById(board.project);
  if (
    userRole !== 'admin' &&
    project.owner.toString() !== userId.toString() &&
    !project.members.includes(userId)
  ) {
    throw new Error('Not authorized');
  }
  return true;
};

// @desc    Get lists for a board
// @route   GET /api/boards/:boardId/lists
// @access  Private
export const getLists = async (req, res) => {
  try {
    await checkAccess(req.params.boardId, req.user._id, req.user.role);
    const lists = await List.find({ board: req.params.boardId }).sort('position');
    res.json(lists);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Create a list
// @route   POST /api/boards/:boardId/lists
// @access  Private
export const createList = async (req, res) => {
  try {
    await checkAccess(req.params.boardId, req.user._id, req.user.role);
    
    const { name } = req.body;
    const lists = await List.find({ board: req.params.boardId });
    const position = lists.length; // Add to end

    const list = new List({
      name,
      board: req.params.boardId,
      position,
    });

    const createdList = await list.save();
    res.status(201).json(createdList);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Update a list
// @route   PUT /api/lists/:id
// @access  Private
export const updateList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    
    await checkAccess(list.board, req.user._id, req.user.role);

    list.name = req.body.name || list.name;
    
    // Allow reordering lists
    if (req.body.position !== undefined) {
      list.position = req.body.position;
    }

    const updatedList = await list.save();
    res.json(updatedList);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Delete a list
// @route   DELETE /api/lists/:id
// @access  Private
export const deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ message: 'List not found' });
    
    await checkAccess(list.board, req.user._id, req.user.role);

    await list.deleteOne();
    res.json({ message: 'List removed' });
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};
