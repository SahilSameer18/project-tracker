import React, { useRef } from 'react';
import type { Task } from '../types';
import { useStore } from '../store';
import { startOfMonth, endOfMonth, eachDayOfInterval, isToday, format, differenceInDays } from 'date-fns';

const DAY_WIDTH = 40;
const BAR_HEIGHT = 30;

export const TimelineView: React.FC = () => {
  const { tasks, filters, users } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const todayIndex = days.findIndex(d => isToday(d));

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) return false;
    if (filters.dueFrom && task.dueDate && task.dueDate < filters.dueFrom) return false;
    if (filters.dueTo && task.dueDate && task.dueDate > filters.dueTo) return false;
    return true;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getBarStyle = (task: Task) => {
    const start = task.startDate || task.dueDate;
    if (!start || !task.dueDate) return null;

    const startIndex = differenceInDays(start, monthStart);
    const endIndex = differenceInDays(task.dueDate, monthStart);
    const left = Math.max(0, startIndex) * DAY_WIDTH;
    const width = Math.max(DAY_WIDTH, (endIndex - startIndex + 1) * DAY_WIDTH);

    return { left, width };
  };

  return (
    <div className="h-full">
      <div className="mb-4 text-sm text-gray-600">
        {format(monthStart, 'MMMM yyyy')}
      </div>
      <div
        ref={containerRef}
        className="border border-gray-200 rounded-lg overflow-x-auto overflow-y-auto"
        style={{ height: 400 }}
      >
        <div className="relative" style={{ width: days.length * DAY_WIDTH, minHeight: 400 }}>
          {/* Days header */}
          <div className="flex border-b border-gray-200 sticky top-0 bg-white z-10">
            {days.map((day, index) => (
              <div
                key={index}
                className="flex-shrink-0 border-r border-gray-200 px-2 py-2 text-center text-xs text-gray-500"
                style={{ width: DAY_WIDTH }}
              >
                {format(day, 'd')}
              </div>
            ))}
          </div>

          {/* Today's line */}
          {todayIndex >= 0 && (
            <div
              className="absolute top-0 bottom-0 border-l-2 border-red-500 z-20"
              style={{ left: todayIndex * DAY_WIDTH }}
            />
          )}

          {/* Tasks */}
          <div className="relative">
            {filteredTasks.map((task, index) => {
              const style = getBarStyle(task);
              if (!style) return null;

              const activeUsers = users.filter(u => u.currentTask === task.id);

              return (
                <div
                  key={task.id}
                  className={`absolute rounded ${getPriorityColor(task.priority)} text-white text-xs px-2 py-1 flex items-center justify-between cursor-pointer hover:opacity-80`}
                  style={{
                    ...style,
                    top: index * (BAR_HEIGHT + 8) + 40, // below header
                    height: BAR_HEIGHT,
                  }}
                  title={`${task.title} - ${task.assignee}`}
                >
                  <span className="truncate">{task.title}</span>
                  {activeUsers.length > 0 && (
                    <div className="flex -space-x-1 ml-2">
                      {activeUsers.slice(0, 2).map(user => (
                        <div
                          key={user.id}
                          className={`w-4 h-4 rounded-full ${user.color} text-white text-xs flex items-center justify-center border border-white`}
                        >
                          {user.name[0]}
                        </div>
                      ))}
                      {activeUsers.length > 2 && (
                        <div className="w-4 h-4 bg-gray-500 text-white text-xs rounded-full flex items-center justify-center border border-white">
                          +{activeUsers.length - 2}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">📅</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks in timeline</h3>
          <p className="text-gray-500">Tasks without due dates are not shown</p>
        </div>
      )}
    </div>
  );
};