import React, { useState, useEffect, useCallback } from 'react';
import type { Task, Status } from '../types';
import { useStore } from '../store';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';

const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

export interface DragState {
  task: Task;
  originStatus: Status;
  width: number;
  height: number;
  offsetX: number;
  offsetY: number;
  originRect: DOMRect;
  currentX: number;
  currentY: number;
}

export const KanbanView: React.FC = () => {
  const { tasks, filters, users, updateTask, setDraggedTask, draggedTask } = useStore();
  const [dragState, setDragState] = useState<DragState | null>(null);
  const [hoveredStatus, setHoveredStatus] = useState<Status | null>(null);
  const [snapBackOrigin, setSnapBackOrigin] = useState<DragState | null>(null);

  const filteredTasks = tasks.filter(task => {
    if (filters.status.length > 0 && !filters.status.includes(task.status)) return false;
    if (filters.priority.length > 0 && !filters.priority.includes(task.priority)) return false;
    if (filters.assignee.length > 0 && !filters.assignee.includes(task.assignee)) return false;
    if (filters.dueFrom && task.dueDate && task.dueDate < filters.dueFrom) return false;
    if (filters.dueTo && task.dueDate && task.dueDate > filters.dueTo) return false;
    return true;
  });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>, task: Task) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    
    // Provide a way to target buttons directly if task cards had any
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    // We don't preventDefault so that touch interactions aren't completely swallowed,
    // but on touch devices we need to ensure scrolling stops. The touch-action css will handle this.
    const rect = e.currentTarget.getBoundingClientRect();
    const newState: DragState = {
      task,
      originStatus: task.status,
      width: rect.width,
      height: rect.height,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      originRect: rect,
      currentX: e.clientX,
      currentY: e.clientY
    };
    
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragState(newState);
    setDraggedTask(task);
    setHoveredStatus(task.status);
  };

  const handlePointerMove = useCallback((e: PointerEvent) => {
    if (!dragState) return;
    setDragState(prev => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);

    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const columnEl = elements.find(el => el.getAttribute('data-status')) as HTMLElement;
    if (columnEl) {
      setHoveredStatus(columnEl.getAttribute('data-status') as Status);
    } else {
      setHoveredStatus(null);
    }
  }, [dragState]);

  const cleanupDrag = useCallback(() => {
    setDragState(null);
    setDraggedTask(null);
    setHoveredStatus(null);
  }, [setDraggedTask]);

  const handlePointerUp = useCallback((e: PointerEvent) => {
    if (!dragState) return;
    
    const elements = document.elementsFromPoint(e.clientX, e.clientY);
    const columnEl = elements.find(el => el.getAttribute('data-status')) as HTMLElement;
    
    if (columnEl) {
      const newStatus = columnEl.getAttribute('data-status') as Status;
      if (dragState.task.status !== newStatus) {
        updateTask(dragState.task.id, { status: newStatus });
      }
      cleanupDrag();
    } else {
      setHoveredStatus(null);
      setSnapBackOrigin(dragState);
      setDragState(null);
      setTimeout(() => {
        setSnapBackOrigin(null);
        setDraggedTask(null);
      }, 300);
    }
  }, [dragState, updateTask, cleanupDrag, setDraggedTask]);

  useEffect(() => {
    if (dragState) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }
    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [dragState, handlePointerMove, handlePointerUp]);

  const activeClone = dragState || snapBackOrigin;

  return (
    <div className="h-full overflow-x-auto">
      <div className="flex gap-6 min-w-max h-full pb-6" style={{ touchAction: dragState ? 'none' : 'auto' }}>
        {statuses.map(status => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={filteredTasks.filter(task => task.status === status && task.id !== draggedTask?.id)}
            users={users}
            isDragOver={hoveredStatus === status}
            dragState={dragState}
            onPointerDown={handlePointerDown}
          />
        ))}
      </div>

      {activeClone && (
        <div
          className={`fixed pointer-events-none z-50 ${snapBackOrigin ? 'transition-all duration-300 ease-out' : ''}`}
          style={{
            width: activeClone.width,
            height: activeClone.height,
            left: snapBackOrigin ? activeClone.originRect.left : activeClone.currentX - activeClone.offsetX,
            top: snapBackOrigin ? activeClone.originRect.top : activeClone.currentY - activeClone.offsetY,
            opacity: snapBackOrigin ? 1 : 0.8,
            boxShadow: snapBackOrigin ? 'none' : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            transform: snapBackOrigin ? 'scale(1)' : 'scale(1.02)'
          }}
        >
          <TaskCard task={activeClone.task} users={users} isDragging={false} />
        </div>
      )}
    </div>
  );
};