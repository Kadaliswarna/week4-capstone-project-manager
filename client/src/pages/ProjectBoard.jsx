import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProjectContext } from '../context/ProjectContext';
import { TaskContext } from '../context/TaskContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import BoardColumn from '../components/BoardColumn';
import TaskModal from '../components/TaskModal';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { Plus, Settings, Filter, Search } from 'lucide-react';
import './ProjectBoard.css';

const ProjectBoard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentProject, fetchProjectById } = useContext(ProjectContext);
  const { boards, fetchBoards, lists, fetchLists, tasks, moveTask, createList } = useContext(TaskContext);
  
  const [boardId, setBoardId] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showListModal, setShowListModal] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  
  // Fetch project and its boards on mount
  useEffect(() => {
    fetchProjectById(id);
    fetchBoards(id);
  }, [id, fetchProjectById, fetchBoards]);

  // Set default board when boards are loaded
  useEffect(() => {
    if (boards && boards.length > 0 && !boardId) {
      setBoardId(boards[0]._id);
    }
  }, [boards, boardId]);

  // Fetch lists when a board is selected
  useEffect(() => {
    if (boardId) {
      fetchLists(boardId);
    }
  }, [boardId, fetchLists]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === 'list') {
      // Reordering lists - skipping for simplicity in this capstone, 
      // but you would reorder lists in local state and hit the API here
      return;
    }

    // Moving a card
    try {
      await moveTask(
        draggableId, 
        source.droppableId, // old list id
        destination.droppableId, // new list id
        destination.index // new position
      );
      // Local state is optimistic or we trigger a refetch
      fetchLists(boardId);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!newListTitle || !boardId) return;
    try {
      await createList(boardId, { name: newListTitle });
      setNewListTitle('');
      setShowListModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const currentLists = lists[boardId] || [];

  return (
    <>
      <Navbar />
      <div className="layout-with-sidebar">
        <Sidebar />
        <main className="board-main-content">
          <div className="board-header">
            <div className="board-title-section">
              <h1>{currentProject?.name || 'Loading...'}</h1>
              <div className="board-actions">
                <div className="search-box">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select 
                  value={priorityFilter} 
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="All">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
                <button className="btn-secondary">
                  <Settings size={18} />
                </button>
              </div>
            </div>
            
            <div className="board-tabs">
              {boards.map(b => (
                <button 
                  key={b._id} 
                  className={`board-tab ${boardId === b._id ? 'active' : ''}`}
                  onClick={() => setBoardId(b._id)}
                >
                  {b.name}
                </button>
              ))}
              <button className="add-board-btn" onClick={() => {/* Add Board Logic */}}>
                <Plus size={16} /> Add Board
              </button>
            </div>
          </div>

          <div className="board-canvas-wrapper">
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="all-lists" direction="horizontal" type="list">
                {(provided) => (
                  <div 
                    className="board-canvas"
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                  >
                    {currentLists.map((list, index) => (
                      <BoardColumn 
                        key={list._id} 
                        list={list} 
                        index={index} 
                        tasks={tasks[list._id] || []}
                        searchQuery={searchQuery}
                        priorityFilter={priorityFilter}
                      />
                    ))}
                    {provided.placeholder}
                    
                    <div className="add-list-container">
                      {!showListModal ? (
                        <button className="add-list-btn glass-panel" onClick={() => setShowListModal(true)}>
                          <Plus size={20} /> Add another list
                        </button>
                      ) : (
                        <div className="add-list-form glass-panel">
                          <input 
                            type="text" 
                            placeholder="Enter list title..." 
                            value={newListTitle}
                            onChange={(e) => setNewListTitle(e.target.value)}
                            autoFocus
                          />
                          <div className="add-list-actions">
                            <button className="btn-primary" onClick={handleCreateList}>Add List</button>
                            <button className="btn-secondary" onClick={() => setShowListModal(false)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </main>
      </div>
    </>
  );
};

export default ProjectBoard;
