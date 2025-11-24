import React, { useState, useEffect } from 'react';
import type { News } from '@/types';

const NewsDetailPage: React.FC = () => {
  const [news, setNews] = useState<News | null>(null);

  useEffect(() => {
    const fetchNews = () => {
      const dummyNews: News = {
        id: 1,
        title: 'Pembukaan Pendaftaran Semester Baru 2025/2026',
        thumbnail: 'https://via.placeholder.com/800x450',
        content: 'Telah dibuka pendaftaran untuk semester baru tahun ajaran 2025/2026. Segera lakukan pendaftaran ulang melalui portal akademik. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi.',
        created_at: '2024-11-23T10:00:00Z',
      };
      setNews(dummyNews);
    };

    fetchNews();
  }, []);

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
              <img src={news.thumbnail} alt={news.title} className="w-full max-w-3xl aspect-video object-cover border-2 border-primary rounded-lg" />
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
