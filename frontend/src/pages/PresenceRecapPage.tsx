import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import type { ApiResponse, PresenceRecapApiResponse, PresenceStatusItem } from '@/types';

const PresenceRecapPage: React.FC = () => {
  const [recapData, setRecapData] = useState<PresenceRecapApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPresenceRecap = async () => {
      try {
        const response = await api.get<ApiResponse<PresenceRecapApiResponse>>('/presence/recap');
        setRecapData(response.data.data);
      } catch (err) {
        console.error('Failed to fetch presence recap', err);
        setError('Failed to load presence recap data.');
      } finally {
        setLoading(false);
      }
    };

    fetchPresenceRecap();
  }, []);

  const getStatusBgColor = (status: PresenceStatusItem['status']) => {
    switch (status) {
      case 'hadir':
        return 'bg-green-400';
      case 'izin':
        return 'bg-yellow-400';
      case 'alpha':
        return 'bg-red-400';
      case 'sakit':
        return 'bg-orange-400';
      default:
        return 'bg-gray-200 border border-dashed border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!recapData || recapData.data.length === 0) {
    return <div className="text-text-main-light dark:text-text-main-dark">No presence recap data available.</div>;
  }

  const weeks = recapData.data.length > 0
    ? Array.from({ length: recapData.data[0].recap.length }, (_, i) => `Pekan ${i + 1}`)
    : [];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
       <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="flex-grow w-full">
          <div className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-primary">Presence Recap</h1>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Total Lateness: <span className="font-semibold">{recapData.lateness_time} minutes</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-flow-col auto-cols-max gap-3 md:gap-4">
                <div className="flex flex-col gap-3 md:gap-4 pt-10 sm:pt-12 items-end">
                  {weeks.map((week, index) => (
                    <div key={index} className="h-14 sm:h-16 flex items-center justify-end font-semibold text-text-secondary-light dark:text-text-secondary-dark text-sm sm:text-base">
                      {week}
                    </div>
                  ))}
                </div>
                {recapData.data.map((classItem, classIndex) => (
                  <div key={classIndex} className="flex flex-col gap-3 md:gap-4 w-24 sm:w-28">
                    <div className="h-10 sm:h-12 flex items-center justify-center font-bold text-primary text-center text-sm sm:text-base">
                      {classItem.class_name}
                    </div>
                    {classItem.recap.map((statusItem, statusIndex) => (
                      <div
                        key={statusIndex}
                        className={`h-14 sm:h-16 text-white flex items-center justify-center font-bold text-xs sm:text-sm
                        border-2 border-primary 
                        ${getStatusBgColor(statusItem.status)}
                        shadow-shadow
                        transition-all duration-200
                        hover:-translate-x-[2px] hover:shadow-none
                        active:-translate-x-[2px] active:shadow-none
                        `}
                      >
                        {statusItem.status === 'hadir' ? 'Hadir' : statusItem.status === 'izin' ? 'Izin' : statusItem.status === 'sakit' ? 'Sakit' : statusItem.status === 'alpha' ? 'Alpha' : '-'}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PresenceRecapPage;
