import React, { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle, Edit, Trash } from 'lucide-react';
import type { News, NewsListItem, ApiResponse, PaginationMeta } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AdminNewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsListItem[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [thumbnailFileId, setThumbnailFileId] = useState<number | null>(null);

  useEffect(() => {
    fetchNews();
  }, [page]);

  const fetchNews = async () => {
    try {
      const response = await api.get<ApiResponse<NewsListItem[]>>(`/admin/news?page=${page}&limit=10`);
      setNews(response.data.data);
      if (response.data.meta) {
        setMeta({
          ...response.data.meta,
          current_page: response.data.meta.page,
          last_page: response.data.meta.totalPage,
        });
      }
    } catch (error) {
      console.error('Failed to fetch news', error);
    }
  };
  
  const handleEdit = async (id: number) => {
      const response = await api.get<ApiResponse<News>>(`/admin/news/${id}`);
      const newsToEdit = response.data.data;
      setEditingNews(newsToEdit);
      setTitle(newsToEdit.title);
      setContent(newsToEdit.content);
      setThumbnailFileId(newsToEdit.thumbnail_file_id);
      setIsModalOpen(true);
  }

  const handleDelete = async (id: number) => {
      if (window.confirm('Are you sure you want to delete this news article?')) {
          try {
            await api.delete(`/admin/news/${id}`);
            fetchNews();
          } catch (error) {
              console.error('Failed to delete news', error);
          }
      }
  }
  
  const handleSave = async () => {
      const payload = { title, content, thumbnail_file_id: thumbnailFileId };
      try {
          if (editingNews) {
              await api.put(`/admin/news/${editingNews.id}`, payload);
          } else {
              await api.post('/admin/news', payload);
          }
          closeModal();
          fetchNews();
      } catch (error) {
          console.error('Failed to save news', error);
      }
  }
  
  const openModalForCreate = () => {
      setEditingNews(null);
      setTitle('');
      setContent('');
      setThumbnailFileId(null);
      setIsModalOpen(true);
  }

  const closeModal = () => {
      setIsModalOpen(false);
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const renderPaginationButtons = () => {
    if (!meta) return null;

    const pages = [];
    for (let i = 1; i <= meta.last_page; i++) {
      pages.push(
        <Button 
          key={i}
          onClick={() => handlePageChange(i)}
          variant={page === i ? "default" : "outline"}
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Manage News</h1>
        <Button onClick={openModalForCreate}>
          <PlusCircle className="mr-2" /> Add News
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>News List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-primary">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Thumbnail</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-secondary-background divide-y divide-gray-200">
                {news.map(item => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img src={item.thumbnail} alt={item.title} className="w-16 h-16 object-cover rounded-md" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button onClick={() => handleEdit(item.id)} variant="outline" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button onClick={() => handleDelete(item.id)} variant="destructive" size="sm" className="ml-2"><Trash className="h-4 w-4" /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
          {meta && meta.last_page > 1 && (    
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">Page {meta.current_page} of {meta.last_page}</p>
              <div className="flex gap-2">
                <Button onClick={() => handlePageChange(page - 1)} disabled={page === 1} variant="outline" size="sm">Previous</Button>
                {renderPaginationButtons()}
                <Button onClick={() => handlePageChange(page + 1)} disabled={page === meta.last_page} variant="outline" size="sm">Next</Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg w-full max-w-2xl">
                  <h2 className="text-2xl font-bold mb-4">{editingNews ? 'Edit' : 'Create'} News</h2>
                  <div className="space-y-4">
                      <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
                      <Textarea placeholder="Content" value={content} onChange={e => setContent(e.target.value)} rows={10}/>
                      <Input type="number" placeholder="Thumbnail File ID" value={thumbnailFileId || ''} onChange={e => setThumbnailFileId(e.target.value ? parseInt(e.target.value) : null)} />
                  </div>
                  <div className="mt-8 flex justify-end gap-4">
                      <Button variant="outline" onClick={closeModal}>Cancel</Button>
                      <Button onClick={handleSave}>Save</Button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AdminNewsPage;
