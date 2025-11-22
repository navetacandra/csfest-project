import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge'


interface TaskItemProps {
  title: string;
  className: string;
  status: 'Completed' | 'Incomplete';
}

const TaskItem: React.FC<TaskItemProps> = ({ title, className, status }) => {
  const isCompleted = status === 'Completed';

  return (
    <Link to="/task/1" className="block">
      <div className="flex justify-between items-center p-4 bg-[#E0FFE8] rounded-lg border-2 border-primary cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:shadow-none shadow-shadow ">
        <div>
          <h3 className="text-lg font-bold text-primary">{title}</h3>
          <p className="text-sm text-text-secondary-light dark:text-text-secondary-dark">{className}</p>
        </div>
        <Badge variant={isCompleted ? 'default' : 'danger'}>
          {isCompleted ? 'Completed' : 'Incomplete'}
        </Badge>
      </div>
    </Link>
  );
};

export default TaskItem;
