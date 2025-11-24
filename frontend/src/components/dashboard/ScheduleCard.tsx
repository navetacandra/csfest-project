import React from 'react';
import { Button } from '@/components/ui/button';
import type { Class } from '@/types';

interface ScheduleCardProps {
  schedule: Class[];
}

const getDayName = (dayIndex: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  return (
    <div className="lg:col-span-3 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">Schedule</h2>
      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="flex justify-between items-center p-4 bg-background rounded-base border-2 border-border hover:shadow-none shadow-shadow hover:-translate-x-[2px] transition-all">
            <div>
              <p className="font-semibold text-foreground">{item.name}</p>
              <p className="text-sm text-foreground/80">{getDayName(item.schedule)}, {item.start_time} - {item.end_time}</p>
            </div>
            <Button>
              Presence
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScheduleCard;
