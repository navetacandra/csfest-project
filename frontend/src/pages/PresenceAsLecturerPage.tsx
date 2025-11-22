import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';

const PresenceAsLecturerPage: React.FC = () => {
  const students = [
    { nim: '1', name: 'A', status: null, lateness: 0 },
    { nim: '1', name: 'A', status: 'Hadir', lateness: 0 },
    { nim: '1', name: 'A', status: 'Izin', lateness: 0 },
    { nim: '1', name: 'A', status: 'Sakit', lateness: 0 },
    { nim: '1', name: 'A', status: 'Alpha', lateness: 0 },
    { nim: '1', name: 'A', status: 'Hadir', lateness: 20 },
  ];

  const getStatusButton = (status: string | null) => {
    switch (status) {
      case 'Hadir':
        return <Button className="w-24 bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 shadow-sm hover:bg-green-200 dark:hover:bg-green-800/50">Hadir</Button>;
      case 'Izin':
        return <Button className="w-24 bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 shadow-sm hover:bg-blue-200 dark:hover:bg-blue-800/50">Izin</Button>;
      case 'Sakit':
        return <Button className="w-24 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300 shadow-sm hover:bg-yellow-200 dark:hover:bg-yellow-800/50">Sakit</Button>;
      case 'Alpha':
        return <Button className="w-24 bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 shadow-sm hover:bg-red-200 dark:hover:bg-red-800/50">Alpha</Button>;
      default:
        return <Button className="w-24 rounded-md bg-gray-200 dark:bg-gray-700 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm">-</Button>;
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 ">
      <div className="max-w-7xl mx-auto border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-6 sm:p-8">
        <main className="flex-grow">
            <div className="mb-6">
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Presence Class</h2>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Class 1</p>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm ring-1 ring-gray-300 dark:ring-gray-700 rounded-lg">
                        <table className="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                            <thead className="bg-gray-200 dark:bg-gray-800">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">NIM</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-sm font-semibold text-gray-900 dark:text-white">Lateness (min)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{student.nim}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{student.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                                            {getStatusButton(student.status)}
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <Input
                                                type="number"
                                                defaultValue={student.lateness}
                                                className="block w-24 mx-auto text-center rounded-md border-gray-300 dark:border-gray-600 bg-background-light dark:bg-background-dark shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
};

export default PresenceAsLecturerPage;
