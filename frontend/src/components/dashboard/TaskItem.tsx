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
      <div className="flex justify-between items-center p-6 border-2 border-primary rounded-lg bg-gray-50/10 dark:bg-gray-800/20 hover:bg-gray-100/10 dark:hover:bg-gray-700/20 transition-colors">
        <div>
          <h3 className="text-2xl font-semibold">{title}</h3>
          <p className="text-gray-500 dark:text-gray-400">{className}</p>
        </div>
        {isCompleted ? <Badge className='w-30 h-10' variant={'default'}>Sudah Dikumpulkan</Badge> :
          <Badge className='w-30 h-10' variant={'danger'}>Belum Dikumpulkan</Badge>}
      </div>
    </Link>
  );
};

export default TaskItem;
