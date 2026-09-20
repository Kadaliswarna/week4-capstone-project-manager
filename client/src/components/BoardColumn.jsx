import React, { useState, useContext } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { MoreHorizontal, Plus } from 'lucide-react';
import TaskCard from './TaskCard';
import { TaskContext } from '../context/TaskContext';
import './BoardColumn.css';

const BoardColumn = ({ list, index, tasks, searchQuery, priorityFilter }) => {
  const { createTask } = useContext(TaskContext);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle) return;
    try {
      await createTask(list._id, { title: newTaskTitle });
      setNewTaskTitle('');
      setShowAddForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Draggable draggableId={list._id} index={index}>
      {(provided) => (
        <div 
          className="board-column glass-panel"
          ref={provided.innerRef}
          {...provided.draggableProps}
        >
          <div className="column-header" {...provided.dragHandleProps}>
            <div className="column-title-container">
              <h3 className="column-title">{list.name}</h3>
              <span className="task-count">{filteredTasks.length}</span>
            </div>
            <button className="icon-btn">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <Droppable droppableId={list._id} type="task">
            {(provided, snapshot) => (
              <div 
                className={`task-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {filteredTasks.map((task, index) => (
                  <TaskCard key={task._id} task={task} index={index} />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          <div className="column-footer">
            {!showAddForm ? (
              <button className="add-card-btn" onClick={() => setShowAddForm(true)}>
                <Plus size={18} /> Add a card
              </button>
            ) : (
              <form className="add-card-form" onSubmit={handleCreateTask}>
                <textarea 
                  placeholder="Enter a title for this card..." 
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  autoFocus
                  rows={2}
                />
                <div className="add-card-actions">
                  <button type="submit" className="btn-primary">Add card</button>
                  <button type="button" className="btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default BoardColumn;
