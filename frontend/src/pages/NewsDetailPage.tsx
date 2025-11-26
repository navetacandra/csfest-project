import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '@/lib/api';
import type { News, ApiResponse } from '@/types';

const NewsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get<ApiResponse<News>>(`/news/${id}`);
        setNews(response.data.data);
      } catch (error) {
        console.error('Failed to fetch news', error);
      }
    };

    if (id) {
      fetchNews();
    }
  }, [id]);

  if (!news) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main className="mt-8">
          <article>
            <header className="mb-8">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-2">{news.title}</h2>
              <p className="text-text-secondary-light dark:text-text-secondary-dark">posted at: {new Date(news.created_at).toLocaleString()}</p>
            </header>
            <div className="mb-12 flex justify-center">
              <img src={`https://kulmsin.juraganweb.web.id/storage/${news.thumbnail}`} alt={news.title} className="w-full max-w-3xl aspect-video object-cover border-2 border-primary rounded-lg" />
            </div>
            <div className="prose prose-lg dark:prose-invert max-w-none text-text-main-light dark:text-text-main-dark">
              <p>{news.content}</p>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
};

export default NewsDetailPage;
