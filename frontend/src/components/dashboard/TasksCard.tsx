import React from 'react';
import TaskItem from './TaskItem';

const tasks = [
  { title: 'Task 1', className: 'class name', status: 'Incomplete' },
  { title: 'Task 2', className: 'class name', status: 'Completed' },
  { title: 'Task 3', className: 'class name', status: 'Incomplete' },
];

const TasksCard: React.FC = () => {
  return (
    <div className="md:col-span-1 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base h-full">
      <h2 className="text-xl font-heading mb-4 text-foreground">Tasks</h2>
      <div className="space-y-4">
        {tasks.map((task, index) => (
          <TaskItem
            key={index}
            title={task.title}
            className={task.className}
            status={task.status as 'Completed' | 'Incomplete'}
          />
        ))}
      </div>
    </div>
  );
};

export default TasksCard;
