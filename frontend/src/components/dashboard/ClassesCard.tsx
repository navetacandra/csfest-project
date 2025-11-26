import React from 'react';
import type { Class } from '@/types';

interface ClassesCardProps {
  classes: Class[];
}

const getDayName = (dayIndex: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

const ClassesCard: React.FC<ClassesCardProps> = ({ classes }) => {
  return (
    <div className="lg:col-span-3 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[240px] overflow-y-auto ps-1 pb-1">
        {classes.map((item) => (
          <div key={item.id} className="bg-background p-4 rounded-base border-2 border-border hover:shadow-none shadow-shadow hover:-translate-x-[2px] transition-all active:shadow-none active:-translate-x-[2px]">
            <p className="font-semibold text-foreground">{item.name}</p>
            <p className="text-sm text-foreground/80">{getDayName(item.schedule)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesCard;
