import React from 'react';
import { Button } from '@/components/ui/button';
import { ClipboardList } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClassPage: React.FC = () => {
  const posts = [
    {
      title: 'Introduction to Web Development',
      date: 'August 21, 2023',
      icon: 'assignment',
    },
    {
      title: 'Week 1 Reading Materials',
      date: 'August 20, 2023',
      icon: 'article',
    },
    {
      title: 'Quiz 1: HTML Basics',
      date: 'August 19, 2023',
      icon: 'quiz',
    },
  ];

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main>
          <div className="flex flex-col sm:flex-row justify-between  sm:items-center mb-8 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Class</h2>
            <div className='flex flex-col sm:flex-row gap-4'>
              <Link to="/presence-as-lecturer">
                <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto">
                  Presence
                </Button>
              </Link>
              <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto">
                Create New Post
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="flex items-center gap-4 sm:gap-5 p-4 sm:p-6 border-2 border-primary rounded-lg bg-[#E0FFE8] cursor-pointer transition-all duration-200 hover:-translate-x-1 hover:shadow-none shadow-shadow"
              >
                <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-green-200 text-primary rounded-lg flex items-center justify-center border-2 border-primary">
                  <ClipboardList className="w-8 h-8 sm:w-10 sm:h-10" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-primary">{post.title}</h3>
                  <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1">Posted on {post.date}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ClassPage;
