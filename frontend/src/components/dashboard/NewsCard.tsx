import type { NewsListItem } from '@/types';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface NewsCardProps {
  news: NewsListItem[];
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const navigate = useNavigate();

  const handleNewsClick = (id: number) => {
    navigate(`/news/${id}`);
  };

  return (
    <div className="md:col-span-2 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">News</h2>
      <div className="space-y-4 max-h-[160px] overflow-y-auto ps-1 pb-1">
        {news.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 p-4 bg-background rounded-base border-2 border-border cursor-pointer 0 transition-all duration-200 hover:-translate-x-1 hover:shadow-none shadow-shadow active:-translate-x-1 active:shadow-none"
            onClick={() => handleNewsClick(item.id)}
          >
            <div className="w-24 h-16 bg-chart-2 rounded-base flex-shrink-0 flex items-center justify-center border-2 border-border">
              <img src={`https://kulmsin.juraganweb.web.id/storage/${item.thumbnail}`} alt={item.title} className="w-full h-full object-cover rounded-base" />
            </div>
            <p className="font-medium text-foreground">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsCard;
