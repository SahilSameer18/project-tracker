import React, { useState, useRef } from 'react';
import type { Status, SortBy } from '../types';
import { useStore } from '../store';
import { ListRow } from './ListRow';

const ROW_HEIGHT = 72;
const CONTAINER_HEIGHT = 600;
const BUFFER = 5;

export const ListView: React.FC = () => {
  const { tasks, filters, sortBy, sortDir, users, updateTask, setFilters, setSort } = useStore();
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) return false;
    if (filters.dueFrom && task.dueDate && task.dueDate < filters.dueFrom) return false;
    if (filters.dueTo && task.dueDate && task.dueDate > filters.dueTo) return false;
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    let aVal: string | number | Date, bVal: string | number | Date;
    const priOrder = { Critical: 4, High: 3, Medium: 2, Low: 1 };
    switch (sortBy) {
      case 'title':
        aVal = a.title;
        bVal = b.title;
        break;
      case 'priority':
        aVal = priOrder[a.priority];
        bVal = priOrder[b.priority];
        break;
      case 'dueDate':
        aVal = a.dueDate || new Date(9999, 1, 1);
        bVal = b.dueDate || new Date(9999, 1, 1);
        break;
    }
    if (sortDir === 'asc') return aVal > bVal ? 1 : -1;
    return aVal < bVal ? 1 : -1;
  });

  const totalHeight = sortedTasks.length * ROW_HEIGHT;
  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER);
  const endIndex = Math.min(sortedTasks.length, startIndex + Math.ceil(CONTAINER_HEIGHT / ROW_HEIGHT) + BUFFER * 2);
  const visibleTasks = sortedTasks.slice(startIndex, endIndex);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  };

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSort(column, sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSort(column, 'asc');
    }
  };

  const handleStatusChange = (id: string, status: Status) => {
    updateTask(id, { status });
  };

  const getSortIcon = (column: SortBy) => {
    if (sortBy !== column) return '↕️';
    return sortDir === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="h-full relative">
      <div className="mb-6 text-sm text-indigo-600 font-medium bg-indigo-50 px-4 py-2 rounded-lg inline-block">
        Showing {sortedTasks.length} of {tasks.length} tasks
      </div>
      <div className="relative">
        {/* Header outside scrollable area */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-t-xl px-6 py-4 flex text-sm font-semibold text-indigo-700 uppercase tracking-wide shadow-sm">
          <div className="flex-1 cursor-pointer hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1" onClick={() => handleSort('title')}>
            <span>Title</span>
            <span className="text-xs">{getSortIcon('title')}</span>
          </div>
          <div className="w-24 cursor-pointer hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1" onClick={() => handleSort('priority')}>
            <span>Priority</span>
            <span className="text-xs">{getSortIcon('priority')}</span>
          </div>
          <div className="w-32 px-3 py-1">Status</div>
          <div className="w-32 px-3 py-1">Assignee</div>
          <div className="w-32 cursor-pointer hover:bg-indigo-100 px-3 py-1 rounded-md transition-colors flex items-center gap-1" onClick={() => handleSort('dueDate')}>
            <span>Due Date</span>
            <span className="text-xs">{getSortIcon('dueDate')}</span>
          </div>
          <div className="w-32 px-3 py-1">Active Users</div>
        </div>
        {/* Scrollable body */}
        <div
          ref={containerRef}
          className="border-l border-r border-b border-indigo-200 rounded-b-xl shadow-sm overflow-auto"
          style={{ height: CONTAINER_HEIGHT }}
          onScroll={handleScroll}
        >
          <div style={{ height: totalHeight, position: 'relative' }}>
            {visibleTasks.map((task, index) => {
              const actualIndex = startIndex + index;
              return (
                <div
                  key={task.id}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: ROW_HEIGHT,
                    transform: `translateY(${actualIndex * ROW_HEIGHT}px)`
                  }}
                >
                  <ListRow
                    task={task}
                    users={users}
                    onStatusChange={handleStatusChange}
                  />
                </div>
              );
            })}
          </div>
          {sortedTasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your filters</p>
              <button
                onClick={() => setFilters({ status: [], priority: [], assignee: [], dueFrom: null, dueTo: null })}
                className="text-blue-600 hover:text-blue-500"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};