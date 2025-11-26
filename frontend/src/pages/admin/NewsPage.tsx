import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { News, NewsListItem, ApiResponse, PaginationMeta } from '@/types';
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

const AdminNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);

  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsListItem | null>(null);
  const [newsToDelete, setNewsToDelete] = useState<NewsListItem | null>(null);
  
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
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

  const fetchNews = useCallback(async () => {
    try {
      const response = await api.get<ApiResponse<NewsListItem[]>>(`/admin/news?page=${page}&limit=10`);
      setNews(response.data.data);
      setMeta({
        size: response.data.meta?.limit || 0,
        page: response.data.meta?.page || 0,
        limit: response.data.meta?.limit || 0,
        totalData: response.data.meta?.totalData || 0,
        totalPage: response.data.meta?.totalPage || 0,
      });
    } catch (error) {
      console.error('Failed to fetch news', error);
    }
  }, [page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const resetForm = () => {
    setSelectedNews(null);
    setFormData({ title: '', content: '' });
    setThumbnailFile(null);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= (meta?.totalPage || 1)) {
        setPage(newPage);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setThumbnailFile(file);
  };

  const handleOpenAddDialog = () => {
    resetForm();
    setIsFormDialogOpen(true);
  };

  const handleOpenEditDialog = async (newsItem: NewsListItem) => {
    resetForm();
    setSelectedNews(newsItem);
    try {
        const response = await api.get<ApiResponse<News>>(`/admin/news/${newsItem.id}`);
        const fullNews = response.data.data;
        setFormData({ title: fullNews.title, content: fullNews.content });
    } catch(error) {
        console.error("Failed to fetch news details", error);
        // Fallback to list data if details fail
        setFormData({ title: newsItem.title, content: 'Could not load content.' });
    }
    setIsFormDialogOpen(true);
  };

  const handleOpenDeleteDialog = (newsItem: NewsListItem) => {
    setNewsToDelete(newsItem);
    setIsDeleteDialogOpen(true);
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    if (thumbnailFile) {
      data.append('thumbnail', thumbnailFile);
    }

    try {
      if (selectedNews) {
        // The API might need a POST request to handle FormData for updates
        await api.put(`/admin/news/${selectedNews.id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        displayAlert('News updated successfully!', 'default');
      } else {
        await api.post('/admin/news', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        displayAlert('News created successfully!', 'default');
      }
      fetchNews();
      setIsFormDialogOpen(false);
    } catch (error) {
      console.error('Failed to save news', error);
      displayAlert('Failed to save news.', 'destructive');
    }
  };

  const handleDelete = async () => {
    if (!newsToDelete) return;
    try {
      await api.delete(`/admin/news/${newsToDelete.id}`);
      fetchNews();
      setIsDeleteDialogOpen(false);
      displayAlert('News deleted successfully!', 'default');
    } catch (error) {
      console.error('Failed to delete news', error);
      displayAlert('Failed to delete news.', 'destructive');
    }
  };

  const renderPaginationButtons = () => {
    if (!meta) return null;
    const pages = [];
    for (let i = 1; i <= meta.totalPage; i++) {
      pages.push(
        <Button key={i} onClick={() => handlePageChange(i)} variant={page === i ? "default" : "outline"} size="sm">{i}</Button>
      );
    }
    return pages;
  };

  return (
    <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base dark:border-gray-600 sm:p-8">
      <h1 className="text-4xl font-bold text-primary mb-8">Manage News</h1>
      
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4">
          <AlertTitle>{alertVariant === 'destructive' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      
      <Card className="mb-8">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>News List</CardTitle>
            <Button onClick={handleOpenAddDialog}>
              <PlusCircle className="mr-2" /> Add News
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-bold uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-right text-xs font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {news.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <img src={`https://kulmsin.juraganweb.web.id/storage/${item.thumbnail}`} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => handleOpenEditDialog(item)} variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button onClick={() => handleOpenDeleteDialog(item)} variant="destructive" size="sm" className="ml-2"><Trash className="h-4 w-4" /></Button>
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
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} variant="outline" size="sm">Previous</Button>
                {renderPaginationButtons()}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === meta.totalPage} variant="outline" size="sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isFormDialogOpen} onOpenChange={setIsFormDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{selectedNews ? 'Edit News' : 'Create News'}</AlertDialogTitle>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="title" className="text-right">Title</Label><Input id="title" value={formData.title} onChange={e => setFormData(p => ({...p, title: e.target.value}))} className="col-span-3" /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="content" className="text-right">Content</Label><Textarea id="content" value={formData.content} onChange={e => setFormData(p => ({...p, content: e.target.value}))} className="col-span-3" rows={6} /></div>
            <div className="grid grid-cols-4 items-center gap-4"><Label htmlFor="thumbnail" className="text-right">Thumbnail</Label><Input id="thumbnail" type="file" onChange={handleFileChange} className="col-span-3" accept="image/*" /></div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleSave}>Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete this news article.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminNewsPage;