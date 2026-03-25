import React from 'react';
import type { Status, Priority } from '../types';
import { useStore } from '../store';
import { Select } from '../components/Select';
import { Button } from '../components/Button';

const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];
const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];

export const Filters: React.FC = () => {
  const { filters, setFilters } = useStore();

  const hasActiveFilters = filters.status.length > 0 || filters.priority.length > 0 || filters.assignee.length > 0 || filters.dueFrom || filters.dueTo;

  const clearFilters = () => {
    setFilters({
      status: [],
      priority: [],
      assignee: [],
      dueFrom: null,
      dueTo: null,
    });
  };

  return (
    <div className="bg-white border-b border-indigo-100 px-6 py-6 shadow-sm">
      <div className="flex flex-wrap gap-6 items-end">
        <div className="min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
          <Select
            options={statuses}
            selected={filters.status}
            onChange={(selected) => setFilters({ ...filters, status: selected as Status[] })}
            placeholder="All statuses"
          />
        </div>
        <div className="min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
          <Select
            options={priorities}
            selected={filters.priority}
            onChange={(selected) => setFilters({ ...filters, priority: selected as Priority[] })}
            placeholder="All priorities"
          />
        </div>
        <div className="min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Assignee</label>
          <Select
            options={assignees}
            selected={filters.assignee}
            onChange={(selected) => setFilters({ ...filters, assignee: selected })}
            placeholder="All assignees"
          />
        </div>
        <div className="min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Due From</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
            value={filters.dueFrom ? filters.dueFrom.toISOString().split('T')[0] : ''}
            onChange={(e) => setFilters({ ...filters, dueFrom: e.target.value ? new Date(e.target.value) : null })}
          />
        </div>
        <div className="min-w-[150px]">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Due To</label>
          <input
            type="date"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:border-gray-400 transition-colors"
            value={filters.dueTo ? filters.dueTo.toISOString().split('T')[0] : ''}
            onChange={(e) => setFilters({ ...filters, dueTo: e.target.value ? new Date(e.target.value) : null })}
          />
        </div>
        {hasActiveFilters && (
          <Button onClick={clearFilters} variant="outline" size="sm" className="ml-4">
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};