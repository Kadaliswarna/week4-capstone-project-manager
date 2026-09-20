import React from 'react';
import './TaskModal.css';

const TaskModal = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-panel animate-fade-in" style={{ maxWidth: '700px' }}>
        <h2>Task Details Placeholder</h2>
        <p>You clicked on: {task.title}</p>
        <button className="btn-secondary mt-4" onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default TaskModal;
