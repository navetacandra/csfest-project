import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Mahasiswa, Major, StudyProgram, ApiResponse, PaginationMeta } from '@/types';
import { useDebounce } from 'react-use';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

const MahasiswaPage: React.FC = () => {
  const [mahasiswa, setMahasiswa] = useState<any[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState({ name: '', major_id: '', study_program_id: '', page: 1, limit: 10 });
  const [majors, setMajors] = useState<Major[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [allStudyPrograms, setAllStudyPrograms] = useState<StudyProgram[]>([]);
  
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedMahasiswa, setSelectedMahasiswa] = useState<Mahasiswa | null>(null);
  const [mahasiswaToDelete, setMahasiswaToDelete] = useState<Mahasiswa | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major_id: '',
    study_program_id: '',
    username: '',
    password: ''
  });
  const [formStudyPrograms, setFormStudyPrograms] = useState<StudyProgram[]>([]);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive'>('default');

  const displayAlert = (message: string, variant: 'default' | 'destructive') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 3000);
  };

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
      setMeta({
        size: response.data.meta?.limit || 0,
        page: response.data.meta?.page || 0,
        limit: response.data.meta?.limit || 0,
        totalData: response.data.meta?.totalData || 0,
        totalPage: response.data.meta?.totalPage || 0,
      });
    } catch (error) {
      console.error('Failed to fetch mahasiswa', error);
    }
  }, [filters]);

  useDebounce(fetchMahasiswa, 500, [filters.name]);
  
  useEffect(() => {
    fetchMahasiswa();
  }, [filters.page, filters.limit, filters.major_id, filters.study_program_id, fetchMahasiswa]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const majorsRes = await api.get<ApiResponse<Major[]>>('/admin/major');
        setMajors(majorsRes.data.data);

        // Fetch all study programs for all majors for table display mapping
        const allProgramsPromises = majorsRes.data.data.map(m =>
          api.get<ApiResponse<StudyProgram[]>>(`/admin/major/${m.id}/study_program`)
        );
        const allProgramsRes = await Promise.all(allProgramsPromises);
        const allPrograms = allProgramsRes.flatMap(res => res.data.data);
        setAllStudyPrograms(allPrograms);

      } catch (error) {
        console.error('Failed to fetch initial data', error);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchStudyProgramsForFilter = async () => {
      if (filters.major_id) {
        try {
          const programsRes = await api.get<ApiResponse<StudyProgram[]>>(`/admin/major/${filters.major_id}/study_program`);
          setStudyPrograms(programsRes.data.data);
        } catch (error) {
          console.error('Failed to fetch study programs for filter', error);
          setStudyPrograms([]);
        }
      } else {
        setStudyPrograms([]);
      }
    };
    fetchStudyProgramsForFilter();
  }, [filters.major_id]);
  
  useEffect(() => {
    if (formData.major_id) {
      const programs = allStudyPrograms.filter(p => String(p.major_id) === formData.major_id);
      setFormStudyPrograms(programs);
    } else {
      setFormStudyPrograms([]);
    }
  }, [formData.major_id, allStudyPrograms]);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value, page: 1 };
    if (key === 'major_id') {
      newFilters.study_program_id = ''; // Reset study program if major changes
    }
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (meta?.totalPage || 1)) {
        setFilters(prev => ({ ...prev, page }));
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedMahasiswa(null);
    setFormData({
       name: '', email: '', major_id: '', study_program_id: '', username: '', password: ''
    });
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (m: Mahasiswa) => {
    setSelectedMahasiswa(m);
    setFormData({
      name: m.name,
      email: m.email,
      major_id: String(m.major_id),
      study_program_id: String(m.study_program_id),
      username: m.username || '',
      password: '' // Password is not sent for updates
    });
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (m: Mahasiswa) => {
    setMahasiswaToDelete(m);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
        const payload = {
            ...formData,
            major_id: Number(formData.major_id),
            study_program_id: Number(formData.study_program_id)
        };
        
        if (selectedMahasiswa) {
            const { password, ...updatePayload } = payload; // Exclude password for update
            await api.put(`/admin/mahasiswa/${selectedMahasiswa.id}`, updatePayload);
            displayAlert('Mahasiswa updated successfully!', 'default');
        } else {
            await api.post('/admin/mahasiswa', payload);
            displayAlert('Mahasiswa created successfully!', 'default');
        }
        fetchMahasiswa();
        setIsFormDialogOpen(false);
    } catch (error) {
        console.error('Failed to save mahasiswa', error);
        displayAlert('Failed to save mahasiswa.', 'destructive');
    }
  };

  const handleDelete = async () => {
      if (!mahasiswaToDelete) return;
      try {
          await api.delete(`/admin/mahasiswa/${mahasiswaToDelete.id}`);
          fetchMahasiswa();
          setIsDeleteDialogOpen(false);
          setMahasiswaToDelete(null);
          displayAlert('Mahasiswa deleted successfully!', 'default');
      } catch (error) {
          console.error('Failed to delete mahasiswa', error);
          displayAlert('Failed to delete mahasiswa.', 'destructive');
      }
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
      
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4">
          <AlertTitle>{alertVariant === 'destructive' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader><CardTitle>Filter Mahasiswa</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-center">
            <Input 
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full sm:w-auto"
            />
            <Select onValueChange={(value) => handleFilterChange('major_id', value)} value={filters.major_id}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Major" /></SelectTrigger>
              <SelectContent>{majors.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent>
            </Select>
            <Select onValueChange={(value) => handleFilterChange('study_program_id', value)} value={filters.study_program_id} disabled={!filters.major_id}>
              <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by Study Program" /></SelectTrigger>
              <SelectContent>{studyPrograms.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent>
            </Select>
            <Button onClick={handleOpenAddDialog} className="ml-auto">
              <PlusCircle className="mr-2" /> Add Mahasiswa
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Mahasiswa List</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Major</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Study Program</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {mahasiswa.map((m) => (
                  <tr key={m.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{m.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{m.major}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{m.study_program}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(m)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleOpenDeleteDialog(m)}><Trash className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {meta && meta.totalData > 0 && (
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

      {/* Add/Edit Dialog */}
      <AlertDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedMahasiswa ? 'Edit Mahasiswa' : 'Add New Mahasiswa'}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="name" className="text-right">Name</Label><Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="email" className="text-right">Email</Label><Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="major" className="text-right">Major</Label><Select onValueChange={(v) => setFormData(p => ({...p, major_id: v, study_program_id: ''}))} value={formData.major_id}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select Major" /></SelectTrigger><SelectContent>{majors.map(m => <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="study_program" className="text-right">Study Program</Label><Select onValueChange={(v) => setFormData(p => ({...p, study_program_id: v}))} value={formData.study_program_id} disabled={!formData.major_id}><SelectTrigger className="col-span-3"><SelectValue placeholder="Select Study Program" /></SelectTrigger><SelectContent>{formStudyPrograms.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="username" className="text-right">Username</Label><Input id="username" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} className="col-span-3" /></div>
            {!selectedMahasiswa && (<div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="password" className="text-right">Password</Label><Input id="password" type="password" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} className="col-span-3" /></div>)}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete the mahasiswa.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setMahasiswaToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MahasiswaPage;