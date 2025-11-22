import React from 'react';
import { Button } from '@/components/ui/button';

interface ScheduleItem {
  title: string;
  time: string;
}

const schedules: ScheduleItem[] = [
  { title: 'Schedule 1', time: 'start - end' },
  { title: 'Schedule 1', time: 'start - end' },
];

const ScheduleCard: React.FC = () => {
  return (
    <div className="lg:col-span-3 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">Schedule</h2>
      <div className="space-y-4">
        {schedules.map((item, index) => (
          <div key={index} className="flex justify-between items-center p-4 bg-background rounded-base border-2 border-border hover:shadow-none shadow-shadow hover:-translate-x-[2px] transition-all">
            <div>
              <p className="font-semibold text-foreground">{item.title}</p>
              <p className="text-sm text-foreground/80">{item.time}</p>
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
