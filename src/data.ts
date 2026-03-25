import type { Task, Status, Priority } from './types';
import { subDays } from 'date-fns';

const assignees = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
const priorities: Priority[] = ['Critical', 'High', 'Medium', 'Low'];
const statuses: Status[] = ['To Do', 'In Progress', 'In Review', 'Done'];

const titles = [
  'Implement user authentication',
  'Design database schema',
  'Create API endpoints',
  'Build frontend components',
  'Write unit tests',
  'Deploy to production',
  'Optimize performance',
  'Add error handling',
  'Update documentation',
  'Refactor legacy code',
  'Integrate third-party service',
  'Conduct security audit',
  'Implement caching',
  'Add logging',
  'Create admin panel',
  'Design responsive layout',
  'Implement search functionality',
  'Add user notifications',
  'Create data visualizations',
  'Implement file upload',
];

export function generateTasks(count: number): Task[] {
  const tasks: Task[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const title = titles[Math.floor(Math.random() * titles.length)] + ` ${i + 1}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];
    const assignee = assignees[Math.floor(Math.random() * assignees.length)];

    // Random date in current month, some null, some overdue
    let startDate: Date | null = null;
    let dueDate: Date | null = null;

    if (Math.random() > 0.2) { // 80% have dates
      const randomDay = Math.floor(Math.random() * 30) + 1;
      dueDate = new Date(now.getFullYear(), now.getMonth(), randomDay);
      if (Math.random() > 0.5) {
        startDate = subDays(dueDate, Math.floor(Math.random() * 7) + 1);
      }
      // Some overdue
      if (Math.random() > 0.7) {
        dueDate = subDays(now, Math.floor(Math.random() * 10) + 1);
      }
    }

    tasks.push({
      id: `task-${i + 1}`,
      title,
      status,
      priority,
      assignee,
      startDate,
      dueDate,
    });
  }

  return tasks;
}