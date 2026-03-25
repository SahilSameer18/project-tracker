import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useStore } from './store';
import { Filters } from './components/Filters';
import { ViewSwitcher } from './components/ViewSwitcher';
import { CollaborationBar } from './components/CollaborationBar';
import { KanbanView } from './views/KanbanView';
import { ListView } from './views/ListView';
import { TimelineView } from './views/TimelineView';
import type { Status, Priority, Filters as FiltersType } from './types';

function App() {
  const { currentView, filters, setFilters, users, updateUser, tasks } = useStore();
  const [searchParams, setSearchParams] = useSearchParams();

  // Sync filters with URL
  useEffect(() => {
    const urlFilters: FiltersType = {
      status: (searchParams.get('status')?.split(',') || []) as Status[],
      priority: (searchParams.get('priority')?.split(',') || []) as Priority[],
      assignee: searchParams.get('assignee')?.split(',') || [],
      dueFrom: searchParams.get('dueFrom') ? new Date(searchParams.get('dueFrom')!) : null,
      dueTo: searchParams.get('dueTo') ? new Date(searchParams.get('dueTo')!) : null,
    };
    setFilters(urlFilters);
  }, [searchParams, setFilters]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (filters.status.length > 0) params.set('status', filters.status.join(','));
    if (filters.priority.length > 0) params.set('priority', filters.priority.join(','));
    if (filters.assignee.length > 0) params.set('assignee', filters.assignee.join(','));
    if (filters.dueFrom) params.set('dueFrom', filters.dueFrom.toISOString().split('T')[0]);
    if (filters.dueTo) params.set('dueTo', filters.dueTo.toISOString().split('T')[0]);

    // Prevent loop: only set if different
    if (params.toString() !== searchParams.toString()) {
      setSearchParams(params);
    }
  }, [filters, searchParams, setSearchParams]);

  // Simulate collaboration
  useEffect(() => {
    const interval = setInterval(() => {
      users.forEach(user => {
        if (Math.random() > 0.8) { // 20% chance to change
          const randomTask = tasks[Math.floor(Math.random() * tasks.length)];
          updateUser(user.id, { currentTask: Math.random() > 0.5 ? randomTask.id : null });
        }
      });
    }, 3000); // every 3 seconds

    return () => clearInterval(interval);
  }, [users, tasks, updateUser]);

  const renderView = () => {
    switch (currentView) {
      case 'kanban': return <KanbanView />;
      case 'list': return <ListView />;
      case 'timeline': return <TimelineView />;
      default: return <KanbanView />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <header className="bg-white shadow-lg border-b border-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Project Tracker
            </h1>
            <ViewSwitcher />
          </div>
        </div>
      </header>
      <CollaborationBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Filters />
      </div>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderView()}
      </main>
    </div>
  );
}

export default App;
