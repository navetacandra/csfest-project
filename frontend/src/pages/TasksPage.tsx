import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom"
import type { TaskItem } from '@/types';

const TasksPage: React.FC = () => {
  const navigate = useNavigate()
  const [tasks, setTasks] = useState<TaskItem[]>([]);

  useEffect(() => {
    const fetchTasks = () => {
      const dummyTasks: TaskItem[] = [
        { id: 1, class_id: 1, title: 'Tugas 1: Web Lanjutan', status: 'incoming' },
        { id: 2, class_id: 2, title: 'Tugas 2: Struktur Data', status: 'completed' },
        { id: 3, class_id: 3, title: 'Tugas 3: Basis Data', status: 'incoming' },
      ];
      setTasks(dummyTasks);
    }

    fetchTasks();
  }, []);

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary">Your Tasks</h2>
            <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none w-full sm:w-auto">
              All
            </Button>
          </div>
          <div className="space-y-6">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="
                        flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6
                        border-2 border-primary rounded-lg
                        bg-[#E0FFE8] cursor-pointer
                        transition-all duration-200
                        hover:-translate-x-1
                        hover:shadow-none
                        shadow-shadow
                      "
                onClick={() => navigate("/task/" + task.id)}
              >
                <div className='mb-4 sm:mb-0'>
                  <h2 className="text-lg sm:text-xl font-bold text-primary">{task.title}</h2>
                  <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    Class ID: {task.class_id}
                  </p>
                </div>

                <Button className="
                        px-5 py-2 border-2 border-black
                        bg-danger text-white rounded-lg font-bold
                        shadow-[-3px_4px_0px_0px_black]
                        hover:translate-y-[2px] hover:shadow-none
                        transition-all w-full sm:w-auto
                      ">
                  View Task
                </Button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TasksPage;
