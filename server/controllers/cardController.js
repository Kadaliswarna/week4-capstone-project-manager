import Card from '../models/Card.js';
import List from '../models/List.js';
import Board from '../models/Board.js';
import Project from '../models/Project.js';

// Helper to check access
const checkAccess = async (listId, userId, userRole) => {
  const list = await List.findById(listId).populate('board');
  if (!list) throw new Error('List not found');
  
  const project = await Project.findById(list.board.project);
  if (
    userRole !== 'admin' &&
    project.owner.toString() !== userId.toString() &&
    !project.members.includes(userId)
  ) {
    throw new Error('Not authorized');
  }
  return { project: project._id, list };
};

// @desc    Get cards for a list
// @route   GET /api/lists/:listId/cards
// @access  Private
export const getCards = async (req, res) => {
  try {
    await checkAccess(req.params.listId, req.user._id, req.user.role);
    const cards = await Card.find({ list: req.params.listId })
      .sort('position')
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    res.json(cards);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Get single card
// @route   GET /api/cards/:id
// @access  Private
export const getCardById = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email avatar');
    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    await checkAccess(card.list, req.user._id, req.user.role);
    res.json(card);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Create a card
// @route   POST /api/lists/:listId/cards
// @access  Private
export const createCard = async (req, res) => {
  try {
    const { project } = await checkAccess(req.params.listId, req.user._id, req.user.role);
    
    const { title, description, assignedTo, priority, dueDate } = req.body;
    const cards = await Card.find({ list: req.params.listId });
    const position = cards.length;

    const card = new Card({
      title,
      description,
      list: req.params.listId,
      project,
      assignedTo: assignedTo || null,
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      position,
      createdBy: req.user._id,
    });

    const createdCard = await card.save();
    // Populate before sending back
    await createdCard.populate('assignedTo', 'name email avatar');
    await createdCard.populate('createdBy', 'name email avatar');
    
    res.status(201).json(createdCard);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Update a card
// @route   PUT /api/cards/:id
// @access  Private
export const updateCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    await checkAccess(card.list, req.user._id, req.user.role);

    const { title, description, assignedTo, priority, dueDate, position, listId } = req.body;

    card.title = title || card.title;
    card.description = description !== undefined ? description : card.description;
    card.assignedTo = assignedTo !== undefined ? assignedTo : card.assignedTo;
    card.priority = priority || card.priority;
    card.dueDate = dueDate !== undefined ? dueDate : card.dueDate;
    
    // Logic for moving/reordering
    if (position !== undefined) card.position = position;
    if (listId && listId !== card.list.toString()) {
      await checkAccess(listId, req.user._id, req.user.role);
      card.list = listId;
    }

    const updatedCard = await card.save();
    await updatedCard.populate('assignedTo', 'name email avatar');
    await updatedCard.populate('createdBy', 'name email avatar');
    
    res.json(updatedCard);
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};

// @desc    Delete a card
// @route   DELETE /api/cards/:id
// @access  Private
export const deleteCard = async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });
    
    await checkAccess(card.list, req.user._id, req.user.role);

    await card.deleteOne();
    res.json({ message: 'Card removed' });
  } catch (error) {
    res.status(error.message === 'Not authorized' ? 403 : 500).json({ message: error.message });
  }
};
