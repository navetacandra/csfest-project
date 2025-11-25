import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Class, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const getDayName = (dayIndex: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[dayIndex];
}

const AdminClassesPage: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [newClassName, setNewClassName] = useState('');
  const [newClassSchedule, setNewClassSchedule] = useState<string>('');

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await api.get<ApiResponse<Class[]>>('/admin/class');
      setClasses(response.data.data);
    } catch (error) {
      console.error('Failed to fetch classes', error);
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/admin/class', { 
          name: newClassName, 
          schedule: parseInt(newClassSchedule, 10)
      });
      setNewClassName('');
      setNewClassSchedule('');
      fetchClasses();
    } catch (error) {
      console.error('Failed to create class', error);
    }
  };

  const handleUpdate = async () => {
    if (!editingClass) return;
    try {
      await api.put(`/admin/class/${editingClass.id}`, { name: editingClass.name, schedule: editingClass.schedule });
      setEditingClass(null);
      fetchClasses();
    } catch (error) {
      console.error('Failed to update class', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/class/${id}`);
      fetchClasses();
    } catch (error) {
      console.error('Failed to delete class', error);
    }
  };

  const handleEditChange = (field: keyof Class, value: any) => {
    if (editingClass) {
      setEditingClass({ ...editingClass, [field]: value });
    }
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Classes</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Class</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value)}
              placeholder="New class name"
            />
            <Select onValueChange={setNewClassSchedule} value={newClassSchedule}>
              <SelectTrigger>
                <SelectValue placeholder="Select schedule day" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({length: 7}, (_, i) => (
                    <SelectItem key={i} value={String(i)}>{getDayName(i)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleCreate} className="sm:col-span-2">
              <PlusCircle className="mr-2" /> Add Class
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Classes List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Class Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Schedule Day</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClass?.id === cls.id ? (
                        <Input 
                          value={editingClass.name}
                          onChange={(e) => handleEditChange('name', e.target.value)}
                        />
                      ) : (
                        cls.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingClass?.id === cls.id ? (
                        <Select onValueChange={(val) => handleEditChange('schedule', parseInt(val,10))} value={String(editingClass.schedule)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({length: 7}, (_, i) => (
                                <SelectItem key={i} value={String(i)}>{getDayName(i)}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        getDayName(cls.schedule)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingClass?.id === cls.id ? (
                        <Button onClick={handleUpdate} size="sm">Save</Button>
                      ) : (
                        <Button onClick={() => setEditingClass(cls)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <Button onClick={() => handleDelete(cls.id)} variant="destructive" size="sm" className="ml-2">
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

export default AdminClassesPage;
