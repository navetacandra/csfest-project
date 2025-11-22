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
    <div className="min-h-screen bg-background-light dark:bg-background-dark text-gray-800 dark:text-gray-200 ">
      <div className="max-w-7xl mx-auto border-2 border-gray-400 dark:border-gray-600 rounded-2xl p-6 sm:p-8">
        <main>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Class</h2>
            <div className='flex gap-2'>
              <Link to="/presence-as-lecturer">
                <Button>Presence</Button>
              </Link>
              <Button>Create New Post</Button>
            </div>
          </div>
          <div className="space-y-4">
            {posts.map((post, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:border-primary transition-all duration-300"
              >
                <div className="flex items-center space-x-5">
                  <div className="flex-shrink-0 w-16 h-16 bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400 rounded-lg flex items-center justify-center">
                    <ClipboardList className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{post.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Posted on {post.date}</p>
                  </div>
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
