import React from 'react';
import TaskItem from './TaskItem';
import type { TaskItem as TaskItemType } from '@/types';

interface TasksCardProps {
  tasks: TaskItemType[];
}

const TasksCard: React.FC<TasksCardProps> = ({ tasks }) => {
  return (
    <div className="md:col-span-1 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base h-full">
      <h2 className="text-xl font-heading mb-4 text-foreground">Tasks</h2>
      <div className="space-y-4 max-h-[320px] overflow-y-auto ps-1 pb-1">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            className="class name" // Placeholder for class name, as it's not in the TaskItem type
          />
        ))}
      </div>
    </div>
  );
};

export default TasksCard;
