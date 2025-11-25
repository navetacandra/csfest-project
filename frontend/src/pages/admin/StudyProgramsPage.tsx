import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Major, StudyProgram, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const StudyProgramsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [selectedMajorId, setSelectedMajorId] = useState<string>('');
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [newStudyProgramName, setNewStudyProgramName] = useState('');
  const [editingStudyProgram, setEditingStudyProgram] = useState<StudyProgram | null>(null);

  useEffect(() => {
    fetchMajors();
  }, []);

  useEffect(() => {
    if (selectedMajorId) {
      fetchStudyPrograms(selectedMajorId);
    } else {
      setStudyPrograms([]);
    }
  }, [selectedMajorId]);

  const fetchMajors = async () => {
    try {
      const response = await api.get<ApiResponse<Major[]>>('/admin/major');
      setMajors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch majors', error);
    }
  };

  const fetchStudyPrograms = async (majorId: string) => {
    try {
      const response = await api.get<ApiResponse<StudyProgram[]>>(`/admin/major/${majorId}/study_program`);
      setStudyPrograms(response.data.data);
    } catch (error) {
      console.error('Failed to fetch study programs', error);
      setStudyPrograms([]);
    }
  };

  const handleCreate = async () => {
    if (!selectedMajorId) return;
    try {
      await api.post(`/admin/major/${selectedMajorId}/study_program`, { name: newStudyProgramName, major_id: Number(selectedMajorId) });
      setNewStudyProgramName('');
      fetchStudyPrograms(selectedMajorId);
    } catch (error) {
      console.error('Failed to create study program', error);
    }
  };

  // const handleUpdate = async () => {
  //   if (!editingStudyProgram || !selectedMajorId) return;
  //   try {
  //     await api.put(`/admin/major/${selectedMajorId}/study_program/${editingStudyProgram.id}`, { name: editingStudyProgram.name });
  //     setEditingStudyProgram(null);
  //     fetchStudyPrograms(selectedMajorId);
  //   } catch (error) {
  //     console.error('Failed to update study program', error);
  //   }
  // };

  const handleDelete = async (studyProgramId: number) => {
    if (!selectedMajorId) return;
    try {
      await api.delete(`/admin/major/${selectedMajorId}/study_program/${studyProgramId}`);
      fetchStudyPrograms(selectedMajorId);
    } catch (error) {
      console.error('Failed to delete study program', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Study Programs</h1>

      <Card className="mb-8">
        <CardHeader>
            <CardTitle>Select Major</CardTitle>
        </CardHeader>
        <CardContent>
            <Select onValueChange={setSelectedMajorId} value={selectedMajorId} >
              <SelectTrigger className="w-full ">
                <SelectValue placeholder="Select a Major" />
              </SelectTrigger>
              <SelectContent>
                {majors.map((major) => (
                  <SelectItem key={major.id} value={String(major.id)}>{major.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
        </CardContent>
      </Card>

      {selectedMajorId && (
        <>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Add New Study Program</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                      <Input
                        value={newStudyProgramName}
                        onChange={(e) => setNewStudyProgramName(e.target.value)}
                        placeholder="New study program name"
                        className="flex-grow shadow-shadow"
                      />
                      <Button onClick={handleCreate}>
                        <PlusCircle className="mr-2" /> Add Study Program
                      </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Study Programs List</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Study Program Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-secondary-background divide-y divide-gray-200">
                                {studyPrograms.map((program) => (
                                <tr key={program.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {editingStudyProgram?.id === program.id ? (
                                            <Input 
                                            value={editingStudyProgram.name}
                                            onChange={(e) => setEditingStudyProgram({ ...editingStudyProgram, name: e.target.value })}
                                            />
                                        ) : (
                                            <p className="font-bold">{program.name}</p>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        {/* {editingStudyProgram?.id === program.id ? (
                                            <Button onClick={handleUpdate}>Save</Button>
                                        ) : (
                                            <Button onClick={() => setEditingStudyProgram(program)} variant="outline" size="sm">
                                            <Edit className="h-4 w-4" />
                                            </Button>
                                        )} */}
                                        <Button onClick={() => handleDelete(program.id)} variant="destructive" size="sm" className="ml-2">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </>
      )}
    </div>
  );
};

export default StudyProgramsPage;
