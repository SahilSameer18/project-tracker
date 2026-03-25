import { create } from 'zustand';
import type { Task, User, View, Filters, SortBy, SortDir } from './types';
import { generateTasks } from './data';

interface AppState {
  tasks: Task[];
  filters: Filters;
  currentView: View;
  sortBy: SortBy;
  sortDir: SortDir;
  users: User[];
  draggedTask: Task | null;
  setTasks: (tasks: Task[]) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  setFilters: (filters: Filters) => void;
  setCurrentView: (view: View) => void;
  setSort: (sortBy: SortBy, sortDir: SortDir) => void;
  setDraggedTask: (task: Task | null) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
}

const initialFilters: Filters = {
  status: [],
  priority: [],
  assignee: [],
  dueFrom: null,
  dueTo: null,
};

const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];

const simulatedUsers: User[] = [
  { id: '1', name: 'Alice', color: colors[0], currentTask: null },
  { id: '2', name: 'Bob', color: colors[1], currentTask: null },
  { id: '3', name: 'Charlie', color: colors[2], currentTask: null },
  { id: '4', name: 'Diana', color: colors[3], currentTask: null },
];

export const useStore = create<AppState>((set) => ({
  tasks: generateTasks(500),
  filters: initialFilters,
  currentView: 'kanban',
  sortBy: 'title',
  sortDir: 'asc',
  users: simulatedUsers,
  draggedTask: null,
  setTasks: (tasks) => set({ tasks }),
  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks.map(task => task.id === id ? { ...task, ...updates } : task)
  })),
  setFilters: (filters) => set({ filters }),
  setCurrentView: (view) => set({ currentView: view }),
  setSort: (sortBy, sortDir) => set({ sortBy, sortDir }),
  setDraggedTask: (task) => set({ draggedTask: task }),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => user.id === id ? { ...user, ...updates } : user)
  })),
}));