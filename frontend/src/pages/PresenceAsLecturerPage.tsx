import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


const PresenceAsLecturerPage: React.FC = () => {
  const [students, setStudents] = useState([
    { nim: '153435354', name: 'Adasdadas', status: null, lateness: 0 },
    { nim: '115343543', name: 'Adasdsadsa', status: 'Hadir', lateness: 0 },
    { nim: '115343543', name: 'Adad', status: 'Izin', lateness: 0 },
    { nim: '115343543', name: 'Adasdsadsadadsa dadasd', status: 'Sakit', lateness: 0 },
    { nim: '115343543', name: 'Adasdada dasdasd dadas', status: 'Alpha', lateness: 0 },
    { nim: '115343543', name: 'Adadsadsa dadsada dadsadada', status: 'Hadir', lateness: 20 },
  ]);

  const handleStatusChange = (index: number, newStatus: string | null) => {
    const updatedStudents = [...students];
    updatedStudents[index].status = newStatus;
    setStudents(updatedStudents);
  };

  const handleLatenessChange = (index: number, newLateness: number) => {
    const updatedStudents = [...students];
    updatedStudents[index].lateness = newLateness;
    setStudents(updatedStudents);
  };

  const handleSave = () => {
    console.log('Saving presence data:', students);
    // Implement actual save logic here (e.g., API call)
    alert('Presence data saved!');
  };

  const getStatusButton = (status: string | null) => {
    const baseButtonClasses = "w-24 border-2 border-black shadow-[-3px_4px_0px_0px_black] hover:translate-y-[2px] hover:shadow-none transition-all font-bold";

    switch (status) {
      case 'Hadir':
        return <Button className={`${baseButtonClasses} bg-green-400 text-white`}>Hadir</Button>;
      case 'Izin':
        return <Button className={`${baseButtonClasses} bg-yellow-400 text-white`}>Izin</Button>;
      case 'Sakit':
        return <Button className={`${baseButtonClasses} bg-orange-400 text-white`}>Sakit</Button>;
      case 'Alpha':
        return <Button className={`${baseButtonClasses} bg-red-400 text-white`}>Alpha</Button>;
      default:
        return <Button className={`${baseButtonClasses} bg-gray-400 text-white`}>-</Button>;
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="flex-grow">
            <div className="mb-6">
                <h2 className="text-4xl font-bold text-primary">Presence Class</h2>
                <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">Class 1</p>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border-2 border-primary rounded-lg shadow-shadow">
                        <table className="min-w-full divide-y dark:divide-gray-700">
                            <thead className="bg-primary">
                                <tr>
                                    <th scope="col" className="px-6 py-3.5 text-left text-sm font-bold">NIM</th>
                                    <th scope="col" className="px-6 py-3.5 text-left text-sm font-bold">Name</th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-sm font-bold">Status</th>
                                    <th scope="col" className="px-6 py-3.5 text-center text-sm font-bold">Lateness (min)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700 bg-secondary-background">
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">{student.nim}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-primary">{student.name}</td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    {getStatusButton(student.status)}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'Hadir')}>Hadir</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'Izin')}>Izin</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'Sakit')}>Sakit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'Alpha')}>Alpha</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, null)}>-</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                                            <Input
                                                type="number"
                                                value={student.lateness}
                                                onChange={(e) => handleLatenessChange(index, parseInt(e.target.value, 10))}
                                                className="block w-24 mx-auto text-center rounded-md border-2 border-primary bg-green-100 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="mt-6 flex justify-end">
                <Button
                    className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none"
                    onClick={handleSave}
                >
                    Save Presence
                </Button>
            </div>
        </main>
      </div>
    </div>
  );
};

export default PresenceAsLecturerPage;
