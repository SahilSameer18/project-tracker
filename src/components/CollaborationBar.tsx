import React from 'react';

import { useStore } from '../store';
import { Avatar } from './Avatar';

export const CollaborationBar: React.FC = () => {
  const { users } = useStore();

  const activeUsers = users.filter(u => u.currentTask);

  if (activeUsers.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 px-6 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-indigo-700 font-semibold">
            {activeUsers.length} {activeUsers.length === 1 ? 'person is' : 'people are'} viewing this board
          </span>
        </div>
        <div className="flex -space-x-1">
          {activeUsers.map(user => (
            <Avatar key={user.id} name={user.name} size="sm" color={user.color} className="ring-2 ring-white shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
};