import React from 'react';
import type { Task, User } from '../types';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { format, isToday, isBefore, differenceInDays } from 'date-fns';

interface TaskCardProps {
  task: Task;
  users: User[];
  onPointerDown?: (e: React.PointerEvent<HTMLDivElement>) => void;
  isDragging: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, users, onPointerDown, isDragging }) => {
  const activeUsers = users.filter(u => u.currentTask === task.id);

  const getDueDateDisplay = () => {
    if (!task.dueDate) return '';
    if (isToday(task.dueDate)) return 'Due Today';
    if (isBefore(task.dueDate, new Date())) {
      const days = differenceInDays(new Date(), task.dueDate);
      if (days > 7) return `${days} days overdue`;
      return format(task.dueDate, 'MMM d');
    }
    return format(task.dueDate, 'MMM d');
  };

  const dueClass = task.dueDate && isBefore(task.dueDate, new Date()) ? 'text-red-600' : 'text-gray-600';

  if (isDragging) {
    // Render the placeholder at the original position when dragging
    return (
       <div className="border-2 border-dashed border-indigo-300 rounded-2xl opacity-60 bg-indigo-50" style={{ height: '130px' }} />
    );
  }

  return (
    <div
      onPointerDown={onPointerDown}
      className="bg-white border border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-indigo-200 transition-all duration-300 cursor-grab active:cursor-grabbing touch-none group hover:scale-105"
    >
      <div className="flex items-start justify-between mb-3 pointer-events-none">
        <h3 className="text-sm font-bold text-gray-900 truncate group-hover:text-indigo-900 transition-colors pr-2">{task.title}</h3>
        <Badge type="priority" value={task.priority} />
      </div>
      <div className="flex items-center justify-between pointer-events-none mb-3">
        <div className="flex items-center space-x-2">
          <Avatar name={task.assignee} size="sm" />
          <span className="text-xs text-gray-600 font-semibold">{task.assignee}</span>
        </div>
        {task.dueDate && (
          <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${dueClass === 'text-red-600' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
            {getDueDateDisplay()}
          </span>
        )}
      </div>
      {activeUsers.length > 0 && (
        <div className="flex -space-x-1 pointer-events-none">
          {activeUsers.slice(0, 2).map(user => (
            <Avatar key={user.id} name={user.name} size="sm" color={user.color} className="ring-2 ring-white shadow-sm" />
          ))}
          {activeUsers.length > 2 && (
            <div className="w-6 h-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs rounded-full flex items-center justify-center ring-2 ring-white shadow-sm font-bold">
              +{activeUsers.length - 2}
            </div>
          )}
        </div>
      )}
    </div>
  );
};