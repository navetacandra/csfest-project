import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Major, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [newMajorName, setNewMajorName] = useState('');
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);

  useEffect(() => {
    fetchMajors();
  }, []);

  const fetchMajors = async () => {
    try {
      const response = await api.get<ApiResponse<Major[]>>('/admin/major');
      setMajors(response.data.data);
    } catch (error) {
      console.error('Failed to fetch majors', error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/admin/major', { name: newMajorName });
      setNewMajorName('');
      fetchMajors();
    } catch (error) {
      console.error('Failed to create major', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingMajor) return;
    try {
      await api.put(`/admin/major/${editingMajor.id}`, { name: editingMajor.name });
      setEditingMajor(null);
      fetchMajors();
    } catch (error) {
      console.error('Failed to update major', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/major/${id}`);
      fetchMajors();
    } catch (error) {
      console.error('Failed to delete major', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Majors</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Major</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input 
              value={newMajorName}
              onChange={(e) => setNewMajorName(e.target.value)}
              placeholder="New major name"
              className="flex-grow"
            />
            <Button onClick={handleCreate}>
              <PlusCircle className="mr-2" /> Add Major
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Majors List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">Major Name</th>
                  <th className="px-6 py-3 text-right text-xs font-medium  uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {majors.map((major) => (
                  <tr key={major.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingMajor?.id === major.id ? (
                        <Input 
                          value={editingMajor.name}
                          onChange={(e) => setEditingMajor({ ...editingMajor, name: e.target.value })}
                        />
                      ) : (
                        <p className="font-bold">{major.name}</p>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingMajor?.id === major.id ? (
                        <Button onClick={handleUpdate}>Save</Button>
                      ) : (
                        <Button onClick={() => setEditingMajor(major)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button onClick={() => handleDelete(major.id)} variant="outline" size="sm" className="ml-2">
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
    </div>
  );
};

export default MajorsPage;
