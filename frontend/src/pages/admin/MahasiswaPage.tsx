import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Mahasiswa, Major, StudyProgram, ApiResponse, PaginationMeta } from '@/types';
import { useDebounce } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MahasiswaPage: React.FC = () => {
  const [mahasiswa, setMahasiswa] = useState<Mahasiswa[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState({ name: '', major_id: '', study_program_id: '', page: 1, limit: 10 });
  const [majors, setMajors] = useState<Major[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);

  const fetchMahasiswa = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.major_id) params.append('major_id', filters.major_id);
      if (filters.study_program_id) params.append('study_program_id', filters.study_program_id);
      params.append('page', String(filters.page));
      params.append('limit', String(filters.limit));
      
      const response = await api.get<ApiResponse<Mahasiswa[]>>(`/admin/mahasiswa?${params.toString()}`);
      setMahasiswa(response.data.data);
      if (response.data.meta) {
        setMeta({
          size: response.data.meta.limit || 0,
          page: response.data.meta.page || 0,
          limit: response.data.meta.limit || 0,
          totalData: response.data.meta.totalData || 0,
          totalPage: response.data.meta.totalPage || 0,
        });
      } else {
        setMeta(null);
      }
    } catch (error) {
      console.error('Failed to fetch mahasiswa', error);
    }
  }, [filters]);

  useDebounce(fetchMahasiswa, 500, [filters.name, fetchMahasiswa]);
  
  useEffect(() => {
    fetchMahasiswa();
  }, [filters.page, filters.limit, filters.major_id, filters.study_program_id, fetchMahasiswa]);

  useEffect(() => {
    const fetchMajorsAndPrograms = async () => {
      try {
        const majorsRes = await api.get<ApiResponse<Major[]>>('/admin/major');
        setMajors(majorsRes.data.data);
        if (filters.major_id) {
            const programsRes = await api.get<ApiResponse<StudyProgram[]>>(`/admin/major/${filters.major_id}/study_program`);
            setStudyPrograms(programsRes.data.data);
        } else {
            setStudyPrograms([]);
        }
      } catch (error) {
        console.error('Failed to fetch majors or study programs', error);
      }
    };
    fetchMajorsAndPrograms();
  }, [filters.major_id]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1, ...(key === 'major_id' && { study_program_id: '' }) }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };
  
  const renderPaginationButtons = () => {
    if (!meta) return null;

    const pages = [];
    for (let i = 1; i <= meta.totalPage; i++) {
      pages.push(
        <Button 
          key={i}
          onClick={() => handlePageChange(i)}
          variant={filters.page === i ? "default" : "outline"}
          className={filters.page === i ? "" : "text-primary"}
          size="sm"
        >
          {i}
        </Button>
      );
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Mahasiswa</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Mahasiswa</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select onValueChange={(value) => handleFilterChange('major_id', value)} value={filters.major_id}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Major" />
              </SelectTrigger>
              <SelectContent>
                {majors.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('study_program_id', value)} value={filters.study_program_id} disabled={!filters.major_id}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Study Program" />
              </SelectTrigger>
              <SelectContent>
                {studyPrograms.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button className="ml-auto">
              <PlusCircle className="mr-2" /> Add Mahasiswa
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mahasiswa List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">NIM</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Major</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Study Program</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {mahasiswa.map((m) => (
                  <tr key={m.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{m.nim}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{m.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{majors.find(major => major.id === m.major_id)?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{studyPrograms.find(sp => sp.id === m.study_program_id)?.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" className="ml-2"><Trash className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {meta && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">Page {meta.page} of {meta.totalPage}</p>
              <div className="flex gap-2">
                <Button onClick={() => handlePageChange(filters.page - 1)} disabled={meta.page === 1} variant="outline" size="sm">Previous</Button>
                {renderPaginationButtons()}
                <Button onClick={() => handlePageChange(filters.page + 1)} disabled={meta.page === meta.totalPage} variant="outline" size="sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MahasiswaPage;
