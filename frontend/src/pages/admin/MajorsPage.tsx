import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { Major, ApiResponse } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const MajorsPage: React.FC = () => {
  const [majors, setMajors] = useState<Major[]>([]);
  const [newMajorName, setNewMajorName] = useState('');
  const [editingMajor, setEditingMajor] = useState<Major | null>(null);
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
      displayAlert('Major created successfully!', 'default');
    } catch (error) {
      console.error('Failed to create major', error);
      displayAlert('Failed to create major.', 'destructive');
    }
  };

  const handleUpdate = async () => {
    if (!editingMajor) return;
    try {
      await api.put(`/admin/major/${editingMajor.id}`, { name: editingMajor.name });
      setEditingMajor(null);
      fetchMajors();
      displayAlert('Major updated successfully!', 'default');
    } catch (error) {
      console.error('Failed to update major', error);
      displayAlert('Failed to update major.', 'destructive');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/admin/major/${id}`);
      fetchMajors();
      displayAlert('Major deleted successfully!', 'default');
    } catch (error) {
      console.error('Failed to delete major', error);
      displayAlert('Failed to delete major.', 'destructive');
    }
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage Majors</h1>
      
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4">
          <AlertTitle>{alertVariant === 'destructive' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button>Save</Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action will update the major's name. Are you sure you want to continue?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={handleUpdate}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      ) : (
                        <Button onClick={() => setEditingMajor(major)} variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-2">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the major.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(major.id)}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
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
