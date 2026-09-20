import Board from '../models/Board.js';
import Project from '../models/Project.js';

// @desc    Get boards for a project
// @route   GET /api/projects/:projectId/boards
// @access  Private
export const getBoards = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check permissions
    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const boards = await Board.find({ project: req.params.projectId });
    res.json(boards);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a board
// @route   POST /api/projects/:projectId/boards
// @access  Private
export const createBoard = async (req, res) => {
  try {
    const { name } = req.body;
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const board = new Board({
      name,
      project: req.params.projectId,
    });

    const createdBoard = await board.save();
    res.status(201).json(createdBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a board
// @route   PUT /api/boards/:id
// @access  Private
export const updateBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const project = await Project.findById(board.project);

    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    board.name = req.body.name || board.name;
    const updatedBoard = await board.save();

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a board
// @route   DELETE /api/boards/:id
// @access  Private
export const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);

    if (!board) {
      return res.status(404).json({ message: 'Board not found' });
    }

    const project = await Project.findById(board.project);

    if (
      req.user.role !== 'admin' &&
      project.owner.toString() !== req.user._id.toString() &&
      !project.members.includes(req.user._id)
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await board.deleteOne();
    res.json({ message: 'Board removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
