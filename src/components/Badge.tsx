import React from 'react';
import type { Priority, Status } from '../types';

interface BadgeProps {
  type: 'priority' | 'status';
  value: Priority | Status;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ type, value, className = '' }) => {
  const getClasses = () => {
    if (type === 'priority') {
      switch (value) {
        case 'Critical': return 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-red-200';
        case 'High': return 'bg-gradient-to-r from-orange-500 to-red-400 text-white shadow-orange-200';
        case 'Medium': return 'bg-gradient-to-r from-yellow-500 to-orange-400 text-white shadow-yellow-200';
        case 'Low': return 'bg-gradient-to-r from-green-500 to-emerald-400 text-white shadow-green-200';
      }
    } else {
      switch (value) {
        case 'To Do': return 'bg-gradient-to-r from-slate-500 to-gray-500 text-white shadow-slate-200';
        case 'In Progress': return 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-blue-200';
        case 'In Review': return 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-purple-200';
        case 'Done': return 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-200';
      }
    }
  };

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getClasses()} ${className}`}>
      {value}
    </span>
  );
};