import React from 'react';
import Header from '@/components/layout/Header';

const PresenceRecapPage: React.FC = () => {
  // Mock data for presence
  const presenceRecapData = {
    totalLateness: 0,
    weeks: ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4', 'Pekan 5', 'Pekan 6', '...', 'Pekan 16'],
    classes: [
      { name: 'Class 1', statuses: ['hadir', 'izint', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 2', statuses: ['hadir', 'alpha', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 3', statuses: ['hadir', 'sakit', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
      { name: 'Class 4', statuses: ['hadir', 'hadir', 'hadir', 'hadir', null, null, null, null] },
    ],
  };

  const getStatusBgColor = (status: string | null) => {
    switch (status) {
      case 'hadir':
        return 'bg-green-700';
      case 'izint':
        return 'bg-yellow-600';
      case 'alpha':
        return 'bg-red-700';
      case 'sakit':
        return 'bg-amber-800';
      default:
        return 'border border-dashed border-gray-400 dark:border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 ">
       <div className="max-w-7xl mx-auto border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-6 sm:p-8">
        <main className="flex-grow w-full">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-primary">Presence Recap</h1>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Total Lateness: <span className="font-semibold">{presenceRecapData.totalLateness} minutes</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-flow-col auto-cols-max gap-3 md:gap-4">
                <div className="flex flex-col gap-3 md:gap-4 pt-12 items-end">
                  {presenceRecapData.weeks.map((week, index) => (
                    <div key={index} className="h-16 flex items-center justify-end font-semibold text-gray-600 dark:text-gray-400">
                      {week}
                    </div>
                  ))}
                </div>
                {presenceRecapData.classes.map((classItem, classIndex) => (
                  <div key={classIndex} className="flex flex-col gap-3 md:gap-4 w-28">
                    <div className="h-12 flex items-center justify-center font-semibold text-gray-700 dark:text-gray-300">
                      {classItem.name}
                    </div>
                    {classItem.statuses.map((status, statusIndex) => (
                      <div
                        key={statusIndex}
                        className={`h-16 rounded-lg text-white flex items-center justify-center font-medium ${getStatusBgColor(status)}`}
                      >
                        {status}
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
