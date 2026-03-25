export type Status = 'To Do' | 'In Progress' | 'In Review' | 'Done';
export type Priority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface Task {
  id: string;
  title: string;
  status: Status;
  priority: Priority;
  assignee: string;
  startDate: Date | null;
  dueDate: Date | null;
}

export interface User {
  id: string;
  name: string;
  color: string;
  currentTask: string | null;
}

export type View = 'kanban' | 'list' | 'timeline';

export interface Filters {
  status: Status[];
  priority: Priority[];
  assignee: string[];
  dueFrom: Date | null;
  dueTo: Date | null;
}

export type SortBy = 'title' | 'priority' | 'dueDate';
export type SortDir = 'asc' | 'desc';