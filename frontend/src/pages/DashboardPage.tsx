import React from 'react';
import NewsCard from '@/components/dashboard/NewsCard';
import TasksCard from '@/components/dashboard/TasksCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ClassesCard from '@/components/dashboard/ClassesCard';

const DashboardPage: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>
        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-8">
            <NewsCard />
            <TasksCard />
          </div>
          <ScheduleCard />
          <ClassesCard />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
