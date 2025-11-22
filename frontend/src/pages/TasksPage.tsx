import React from 'react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import TaskItem from '@/components/dashboard/TaskItem';

const tasks = [
  { title: 'Task Title 1', className: 'class name', status: 'Completed' },
  { title: 'Task Title 2', className: 'class name', status: 'Incomplete' },
  { title: 'Task Title 3', className: 'class name', status: 'Completed' },
  { title: 'Task Title 4', className: 'class name', status: 'Incomplete' },
];

const TasksPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200">
      <div className="max-w-7xl mx-auto border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-6 sm:p-8">
        <main>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-primary">Your Tasks</h2>
            <Button className="bg-yellow-900/50 text-yellow-200 border-2 border-yellow-600 px-8 py-2 rounded-lg text-lg hover:bg-yellow-900/70 transition-colors">
              All
            </Button>
          </div>
          <div className="space-y-6">
            {tasks.map((task, index) => (
              <TaskItem
                key={index}
                title={task.title}
                className={task.className}
                status={task.status as 'Completed' | 'Incomplete'}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
