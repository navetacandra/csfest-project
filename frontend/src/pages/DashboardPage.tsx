import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/dashboard/NewsCard';
import TasksCard from '@/components/dashboard/TasksCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ClassesCard from '@/components/dashboard/ClassesCard';
import api from '@/lib/api';
import type { DashboardData, ApiResponse } from '@/types';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get<ApiResponse<DashboardData>>('/dashboard');
        setDashboardData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Dashboard</h1>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <NewsCard news={dashboardData.news} />
            <ScheduleCard schedule={dashboardData.schedule} />
          </div>
          <div className="space-y-8 h-full">
            <TasksCard tasks={dashboardData.tasks} />
          </div>
            <ClassesCard classes={dashboardData.classes} />
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
