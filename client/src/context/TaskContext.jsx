import React, { createContext, useState, useCallback, useContext } from 'react';
import api from '../api/axios';
import { AuthContext } from './AuthContext';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [boards, setBoards] = useState([]);
  const [lists, setLists] = useState({}); // Mapping boardId -> lists array
  const [tasks, setTasks] = useState({}); // Mapping listId -> tasks array
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBoards = useCallback(async (projectId) => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await api.get(`/projects/${projectId}/boards`);
      setBoards(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch boards');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createBoard = async (projectId, boardData) => {
    try {
      const response = await api.post(`/projects/${projectId}/boards`, boardData);
      setBoards([...boards, response.data]);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create board');
      throw err;
    }
  };

  const fetchLists = useCallback(async (boardId) => {
    if (!user) return;
    try {
      const response = await api.get(`/boards/${boardId}/lists`);
      setLists(prev => ({ ...prev, [boardId]: response.data }));
      
      // Fetch tasks for each list
      response.data.forEach(list => fetchTasks(list._id));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch lists');
    }
  }, [user]);

  const createList = async (boardId, listData) => {
    try {
      const response = await api.post(`/boards/${boardId}/lists`, listData);
      setLists(prev => {
        const boardLists = prev[boardId] || [];
        return { ...prev, [boardId]: [...boardLists, response.data] };
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create list');
      throw err;
    }
  };

  const fetchTasks = useCallback(async (listId) => {
    if (!user) return;
    try {
      const response = await api.get(`/lists/${listId}/cards`);
      setTasks(prev => ({ ...prev, [listId]: response.data }));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch tasks');
    }
  }, [user]);

  const createTask = async (listId, taskData) => {
    try {
      const response = await api.post(`/lists/${listId}/cards`, taskData);
      setTasks(prev => {
        const listTasks = prev[listId] || [];
        return { ...prev, [listId]: [...listTasks, response.data] };
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
      throw err;
    }
  };

  const updateTask = async (taskId, listId, taskData) => {
    try {
      const response = await api.put(`/cards/${taskId}`, taskData);
      
      // Update in local state
      setTasks(prev => {
        const listTasks = prev[listId] || [];
        return {
          ...prev,
          [listId]: listTasks.map(t => t._id === taskId ? response.data : t)
        };
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      throw err;
    }
  };

  const moveTask = async (taskId, sourceListId, destinationListId, newPosition) => {
    // Optimistic UI update could be done here, but we will rely on the components
    // to manage optimistic state and call this to persist.
    try {
      const response = await api.put(`/cards/${taskId}`, {
        listId: destinationListId,
        position: newPosition
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to move task');
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
        boards,
        lists,
        tasks,
        loading,
        error,
        fetchBoards,
        createBoard,
        fetchLists,
        createList,
        fetchTasks,
        createTask,
        updateTask,
        moveTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
