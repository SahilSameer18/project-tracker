import React from 'react';
import type { Task, Status, User } from '../types';
import { Badge } from '../components/Badge';
import { Avatar } from '../components/Avatar';
import { Dropdown } from '../components/Dropdown';
import { format, isToday, isBefore, differenceInDays } from 'date-fns';

interface ListRowProps {
  task: Task;
  users: User[];
  onStatusChange: (id: string, status: Status) => void;
}

export const ListRow: React.FC<ListRowProps> = ({ task, users, onStatusChange }) => {
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

  return (
    <div style={{ height: 72 }} className="border-b border-indigo-100 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 px-6 flex items-center box-border transition-colors duration-150">
      <div className="flex-1 text-sm font-semibold text-gray-900 truncate pr-3">{task.title}</div>
      <div className="w-24 pr-3">
        <Badge type="priority" value={task.priority} />
      </div>
      <div className="w-32 pr-3">
        <Dropdown
          options={['To Do', 'In Progress', 'In Review', 'Done']}
          selected={task.status}
          onChange={(status) => onStatusChange(task.id, status as Status)}
          className="w-full"
        />
      </div>
      <div className="w-32 pr-3 flex items-center">
        <Avatar name={task.assignee} size="sm" />
        <span className="ml-2 text-sm text-gray-900 truncate font-medium">{task.assignee}</span>
      </div>
      <div className="w-32 pr-3">
        {task.dueDate && (
          <span className={`text-sm font-medium px-2 py-1 rounded-md ${dueClass === 'text-red-600' ? 'bg-red-50 text-red-700' : 'bg-gray-50 text-gray-600'}`}>
            {getDueDateDisplay()}
          </span>
        )}
      </div>
      <div className="w-32 pr-2">
        {activeUsers.length > 0 && (
          <div className="flex -space-x-1">
            {activeUsers.slice(0, 2).map(user => (
              <Avatar key={user.id} name={user.name} size="sm" color={user.color} className="ring-2 ring-white" />
            ))}
            {activeUsers.length > 2 && (
              <div className="w-6 h-6 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center ring-2 ring-white">
                +{activeUsers.length - 2}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};