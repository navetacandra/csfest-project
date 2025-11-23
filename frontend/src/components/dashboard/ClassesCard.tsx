import React from 'react';

interface ClassItem {
  title: string;
  schedule: string;
}

const classes: ClassItem[] = [
  { title: 'Class 1', schedule: 'schedule (day)' },
  { title: 'Class 1', schedule: 'schedule (day)' },
  { title: 'Class 1', schedule: 'schedule (day)' },
  { title: 'Class 1', schedule: 'schedule (day)' },
];

const ClassesCard: React.FC = () => {
  return (
    <div className="lg:col-span-3 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">Classes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {classes.map((item, index) => (
          <div key={index} className="bg-background p-4 rounded-base border-2 border-border hover:shadow-none shadow-shadow hover:-translate-x-[2px] transition-all">
            <p className="font-semibold text-foreground">{item.title}</p>
            <p className="text-sm text-foreground/80">{item.schedule}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClassesCard;
