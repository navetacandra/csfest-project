import React from 'react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import api from '@/lib/api';

const PresenceAsLecturerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [students, setStudents] = useState([
    { studentId: 1, nim: '153435354', name: 'Adasdadas', status: null as string | null, lateness: 0 },
    { studentId: 2, nim: '115343543', name: 'Adasdsadsa', status: 'hadir' as string | null, lateness: 0 },
    { studentId: 3, nim: '115343543', name: 'Adad', status: 'izin' as string | null, lateness: 0 },
    { studentId: 4, nim: '115343543', name: 'Adasdsadsadadsa dadasd', status: 'sakit' as string | null, lateness: 0 },
    { studentId: 5, nim: '115343543', name: 'Adasdada dasdasd dadas', status: 'alpha' as string | null, lateness: 0 },
    { studentId: 6, nim: '115343543', name: 'Adadsadsa dadsada dadsadada', status: 'hadir' as string | null, lateness: 20 },
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

  const handleSave = async () => {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    for (const student of students) {
      if (student.status) {
        try {
          await api.post(`/presence/${id}`, {
            schedule_date: today,
            status: student.status,
            studentId: student.studentId,
            late_time: student.lateness,
          });
        } catch (error) {
          console.error(`Failed to save presence for student ${student.name}`, error);
          alert(`Failed to save presence for student ${student.name}. Please try again.`);
          return; 
        }
      }
    }
    alert('Presence data saved successfully!');
  };

  const getStatusButton = (status: string | null) => {
    const baseButtonClasses = "w-24 border-2 border-black shadow-[-3px_4px_0px_0px_black] hover:translate-y-[2px] hover:shadow-none transition-all font-bold";

    switch (status) {
      case 'hadir':
        return <Button className={`${baseButtonClasses} bg-green-400 text-white`}>Hadir</Button>;
      case 'izin':
        return <Button className={`${baseButtonClasses} bg-yellow-400 text-white`}>Izin</Button>;
      case 'sakit':
        return <Button className={`${baseButtonClasses} bg-orange-400 text-white`}>Sakit</Button>;
      case 'alpha':
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
                <h2 className="text-3xl sm:text-4xl font-bold text-primary">Presence Class</h2>
                <p className="mt-1 text-text-secondary-light dark:text-text-secondary-dark">Class 1</p>
            </div>
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden border-2 border-primary rounded-lg shadow-shadow">
                        <table className="min-w-full divide-y dark:divide-gray-700">
                            <thead className="bg-primary">
                                <tr>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3.5 text-left text-sm font-bold">NIM</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3.5 text-left text-sm font-bold">Name</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3.5 text-center text-sm font-bold">Status</th>
                                    <th scope="col" className="px-4 py-3 sm:px-6 sm:py-3.5 text-center text-sm font-bold">Lateness (min)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y dark:divide-gray-700 bg-secondary-background">
                                {students.map((student, index) => (
                                    <tr key={index}>
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-text-secondary-light dark:text-text-secondary-dark">{student.nim}</td>
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm font-bold text-primary">{student.name}</td>
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm text-center">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    {getStatusButton(student.status)}
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'hadir')}>Hadir</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'izin')}>Izin</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'sakit')}>Sakit</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, 'alpha')}>Alpha</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(index, null)}>-</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 sm:px-6 sm:py-4 text-sm">
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
                    className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto"
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
