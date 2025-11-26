import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import type { TaskItem as TaskItemType } from '@/types';

interface TaskItemProps {
  task: TaskItemType;
  className?: string; // classname is not part of TaskItem, so pass it separately if needed
}

const TaskItem: React.FC<TaskItemProps> = ({ task, className }) => {
  const isCompleted = task.status === 'completed';

  return (
    <Link to={`/class/${task.class_id}/task/${task.id}`} className="block">
      <div className="flex justify-between items-center p-4 bg-[#E0FFE8] rounded-lg border-2 border-primary cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:shadow-none shadow-shadow active:-translate-x-1 active:shadow-none ">
        <div>
          <h3 className="text-lg font-bold text-primary">{task.title}</h3>
          {className && <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{className}</p>}
        </div>
        <Badge variant={isCompleted ? 'default' : 'danger'}>
          {task.status}
        </Badge>
      </div>
    </Link>
  );
};

export default TaskItem;
