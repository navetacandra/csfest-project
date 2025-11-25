import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Dosen, ApiResponse, PaginationMeta } from '@/types';
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

const DosenPage: React.FC = () => {
  const [dosen, setDosen] = useState<Dosen[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [filters, setFilters] = useState({ name: '', nip: '', page: 1, limit: 10 });

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDosen, setSelectedDosen] = useState<Dosen | null>(null);
  const [dosenToDelete, setDosenToDelete] = useState<Dosen | null>(null);
  const [formData, setFormData] = useState({ name: '', nip: '', username: '' , password: ''});

  const fetchDosen = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (filters.name) params.append('name', filters.name);
      if (filters.nip) params.append('nip', filters.nip);
      params.append('page', String(filters.page));
      params.append('limit', String(filters.limit));
      
      const response = await api.get<ApiResponse<Dosen[]>>(`/admin/dosen?${params.toString()}`);
      setDosen(response.data.data);
      setMeta({
        size: response.data.meta?.limit || 0,
        page: response.data.meta?.page || 0,
        limit: response.data.meta?.limit || 0,
        totalData: response.data.meta?.totalData || 0,
        totalPage: response.data.meta?.totalPage || 0,
      });
    } catch (error) {
      console.error('Failed to fetch dosen', error);
    }
  }, [filters]);

  useDebounce(fetchDosen, 500, [filters.name, filters.nip]);

  useEffect(() => {
    fetchDosen();
  }, [filters.page, filters.limit, fetchDosen]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= (meta?.totalPage || 1)) {
      setFilters(prev => ({ ...prev, page }));
    }
  };

  const handleOpenAddDialog = () => {
    setSelectedDosen(null);
    setFormData({ name: '', nip: '', username: '' , password: ''});
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = (dosen: Dosen) => {
    setSelectedDosen(dosen);
    setFormData({ name: dosen.name, nip: dosen.nip, username: dosen.username || '' , password: ''});
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (dosen: Dosen) => {
    setDosenToDelete(dosen);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (selectedDosen) {
        // According to openapi.yaml, only name and nip can be updated.
        await api.put(`/admin/dosen/${selectedDosen.id}`, { name: formData.name, nip: formData.nip });
      } else {
        await api.post('/admin/dosen', formData);
      }
      fetchDosen();
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to save dosen', error);
      // You might want to show an error to the user here
    }
  };

  const handleDelete = async () => {
    if (!dosenToDelete) return;
    try {
      await api.delete(`/admin/dosen/${dosenToDelete.id}`);
      fetchDosen();
      setIsDeleteDialogOpen(false);
      setDosenToDelete(null);
    } catch (error) {
      console.error('Failed to delete dosen', error);
      // You might want to show an error to the user here
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
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Dosen</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter Dosen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Input 
              placeholder="Filter by name..."
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
              className="w-full sm:w-auto"
            />
            <Input 
              placeholder="Filter by NIP..."
              value={filters.nip}
              onChange={(e) => handleFilterChange('nip', e.target.value)}
              className="w-full sm:w-auto"
            />
            <Button onClick={handleOpenAddDialog} className="ml-auto">
              <PlusCircle className="mr-2" /> Add Dosen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dosen List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">NIP</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Username</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {dosen.map((d) => (
                  <tr key={d.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{d.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{d.nip}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{d.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button variant="outline" size="sm" onClick={() => handleOpenEditDialog(d)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleOpenDeleteDialog(d)}><Trash className="h-4 w-4" /></Button>
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
            <AlertDialogTitle>{selectedDosen ? 'Edit Dosen' : 'Add New Dosen'}</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDosen ? 'Update the details of the selected dosen.' : 'Please fill in the form to add a new dosen.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Name</Label>
              <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="nip" className="text-right">NIP</Label>
              <Input id="nip" value={formData.nip} onChange={(e) => setFormData(p => ({ ...p, nip: e.target.value }))} className="col-span-3" />
            </div>
            {!selectedDosen && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="username" className="text-right">Username</Label>
                <Input id="username" value={formData.username} onChange={(e) => setFormData(p => ({ ...p, username: e.target.value }))} className="col-span-3" />
              </div>
            )}
            {!selectedDosen && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="password" className="text-right">Password</Label>
                <Input id="password" value={formData.password} onChange={(e) => setFormData(p => ({ ...p, password: e.target.value }))} className="col-span-3" />
              </div>
            )}
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
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the dosen and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDosenToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DosenPage;