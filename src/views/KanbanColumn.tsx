import React from 'react';
import type { Task, Status, User } from '../types';
import { TaskCard } from './TaskCard';
import type { DragState } from './KanbanView';

interface KanbanColumnProps {
  status: Status;
  tasks: Task[];
  users: User[];
  isDragOver: boolean;
  dragState: DragState | null;
  onPointerDown: (e: React.PointerEvent<HTMLDivElement>, task: Task) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  status,
  tasks,
  users,
  isDragOver,
  dragState,
  onPointerDown,
}) => {
  return (
    <div
      data-status={status}
      className={`flex-1 min-w-80 bg-gradient-to-b from-white to-gray-50 rounded-2xl p-6 min-h-96 transition-all duration-300 shadow-lg hover:shadow-xl border border-gray-100 ${
        isDragOver ? 'bg-gradient-to-b from-indigo-50 to-purple-50 border-indigo-300 shadow-2xl scale-105' : 'hover:border-indigo-200'
      }`}
    >
      <div className="flex items-center justify-between mb-6 pointer-events-none">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${
            status === 'To Do' ? 'bg-slate-400' :
            status === 'In Progress' ? 'bg-blue-500' :
            status === 'In Review' ? 'bg-purple-500' :
            'bg-emerald-500'
          }`}></div>
          {status}
        </h2>
        <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold shadow-sm">
          {tasks.length + (dragState?.originStatus === status ? 1 : 0)}
        </span>
      </div>
      <div className="space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto pb-6 scrollbar-thin scrollbar-thumb-indigo-300 scrollbar-track-transparent">
        {tasks.map(task => (
          <React.Fragment key={task.id}>
            <TaskCard
              task={task}
              users={users}
              onPointerDown={(e) => onPointerDown(e, task)}
              isDragging={dragState?.task.id === task.id}
            />
          </React.Fragment>
        ))}
        {dragState && dragState.task.status === status && !tasks.find(t => t.id === dragState.task.id) && (
          <div
            className="border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50"
            style={{ height: dragState.height }}
          />
        )}
        {dragState && isDragOver && dragState.task.status !== status && (
          <div
            className="border-2 border-dashed border-indigo-300 rounded-xl bg-indigo-50"
            style={{ height: dragState.height }}
          />
        )}
        {tasks.length === 0 && !isDragOver && (!dragState || dragState.task.status !== status) && (
          <div className="text-center py-8 text-gray-400 pointer-events-none">
            <div className="text-3xl mb-2">📋</div>
            <p className="text-sm">No tasks in {status.toLowerCase()}</p>
          </div>
        )}
      </div>
    </div>
  );
};