import React, { useState, useEffect } from 'react';
import NewsCard from '@/components/dashboard/NewsCard';
import TasksCard from '@/components/dashboard/TasksCard';
import ScheduleCard from '@/components/dashboard/ScheduleCard';
import ClassesCard from '@/components/dashboard/ClassesCard';
import type { DashboardData } from '@/types';

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);

  useEffect(() => {
    // Mock API call
    const fetchDashboardData = () => {
      const dummyData: DashboardData = {
        news: [
          { id: 1, title: 'Pembukaan Pendaftaran Semester Baru 2025/2026', thumbnail: 'https://via.placeholder.com/150' },
          { id: 2, title: 'Juara 1 Lomba Competitive Programming', thumbnail: 'https://via.placeholder.com/150' },
        ],
        schedule: [
          { id: 1, name: 'Pemrograman Web Lanjutan', schedule: 1, start_time: '08:00', end_time: '10:00' },
          { id: 2, name: 'Struktur Data', schedule: 2, start_time: '10:00', end_time: '12:00' },
        ],
        tasks: [
          { id: 1, class_id: 1, title: 'Tugas 1: Web Lanjutan', status: 'incoming' },
          { id: 2, class_id: 2, title: 'Tugas 2: Struktur Data', status: 'completed' },
        ],
        classes: [
          { id: 1, name: 'Pemrograman Web Lanjutan', schedule: 1, start_time: '08:00', end_time: '10:00' },
          { id: 2, name: 'Struktur Data', schedule: 2, start_time: '10:00', end_time: '12:00' },
          { id: 3, name: 'Basis Data', schedule: 3, start_time: '13:00', end_time: '15:00' },
        ],
      };
      setDashboardData(dummyData);
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
