import React from 'react';
import { useStore } from '../store';
import { Button } from './Button';

export const ViewSwitcher: React.FC = () => {
  const { currentView, setCurrentView } = useStore();

  return (
    <div className="flex space-x-2">
      <Button
        variant={currentView === 'kanban' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setCurrentView('kanban')}
      >
        Kanban
      </Button>
      <Button
        variant={currentView === 'list' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setCurrentView('list')}
      >
        List
      </Button>
      <Button
        variant={currentView === 'timeline' ? 'primary' : 'outline'}
        size="sm"
        onClick={() => setCurrentView('timeline')}
      >
        Timeline
      </Button>
    </div>
  );
};