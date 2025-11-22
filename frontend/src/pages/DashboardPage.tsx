import React from 'react';
import NewsCard from '@/components/dashboard/NewsCard';
import TasksCard from '@/components/dashboard/TasksCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ClassesCard from '@/components/dashboard/ClassesCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen ">
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
          <NewsCard />
          <TasksCard />
        </div>
        <ScheduleCard />
        <ClassesCard />
      </main>
    </div>
  );
};

export default DashboardPage;
