import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { AlignLeft, MessageSquare, Clock } from 'lucide-react';
import './TaskCard.css';

const TaskCard = ({ task, index }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          className={`task-card ${snapshot.isDragging ? 'dragging' : ''}`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className="task-labels">
            {task.priority && (
              <span className={`task-badge priority-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
            )}
            {isOverdue && (
              <span className="task-badge overdue">Overdue</span>
            )}
          </div>
          
          <h4 className="task-title">{task.title}</h4>
          
          {task.description && (
            <p className="task-desc-preview">
              <AlignLeft size={14} className="inline-icon" />
            </p>
          )}

          <div className="task-footer">
            <div className="task-indicators">
              {task.dueDate && (
                <div className={`indicator ${isOverdue ? 'text-danger' : ''}`}>
                  <Clock size={14} />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {/* If we had comments array on task, we'd show count here */}
              <div className="indicator">
                <MessageSquare size={14} />
                <span>0</span>
              </div>
            </div>
            
            {task.assignedTo && (
              <div className="task-assignee">
                {task.assignedTo.avatar ? (
                  <img src={task.assignedTo.avatar} alt="Assignee" />
                ) : (
                  <span>{task.assignedTo.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
};

export default TaskCard;
