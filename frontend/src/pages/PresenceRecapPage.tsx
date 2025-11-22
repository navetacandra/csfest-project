import React from 'react';


const PresenceRecapPage: React.FC = () => {
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
        return 'bg-green-400';
      case 'izint':
        return 'bg-yellow-400';
      case 'alpha':
        return 'bg-red-400';
      case 'sakit':
        return 'bg-orange-400';
      default:
        return 'bg-gray-200 border border-dashed border-gray-400 dark:border-gray-600 text-gray-700 dark:text-gray-400';
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
       <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="flex-grow w-full">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-primary">Presence Recap</h1>
            <p className="mt-2 text-text-secondary-light dark:text-text-secondary-dark">
              Total Lateness: <span className="font-semibold">{presenceRecapData.totalLateness} minutes</span>
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <div className="grid grid-flow-col auto-cols-max gap-3 md:gap-4">
                <div className="flex flex-col gap-3 md:gap-4 pt-12 items-end">
                  {presenceRecapData.weeks.map((week, index) => (
                    <div key={index} className="h-16 flex items-center justify-end font-semibold text-text-secondary-light dark:text-text-secondary-dark">
                      {week}
                    </div>
                  ))}
                </div>
                {presenceRecapData.classes.map((classItem, classIndex) => (
                  <div key={classIndex} className="flex flex-col gap-3 md:gap-4 w-28">
                    <div className="h-12 flex items-center justify-center font-bold text-primary">
                      {classItem.name}
                    </div>
                    {classItem.statuses.map((status, statusIndex) => (
                      <div
                        key={statusIndex}
                        className={`h-16 text-white flex items-center justify-center font-bold
                        border-2 border-primary 
                        ${getStatusBgColor(status)}
                        shadow-shadow
                        transition-all duration-200
                        hover:-translate-y-[2px] hover:shadow-none
                        `}
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
