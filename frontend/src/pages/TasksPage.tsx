import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from "react-router-dom"

const tasks = [
  { id: 1, title: 'Task Title 1', className: 'class name', status: 'Completed' },
  { id: 2, title: 'Task Title 2', className: 'class name', status: 'Incomplete' },
  { id: 3, title: 'Task Title 3', className: 'class name', status: 'Completed' },
  { id: 4, title: 'Task Title 4', className: 'class name', status: 'Incomplete' },
];

const TasksPage: React.FC = () => {
  const navigate = useNavigate()


  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <main>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-primary">Your Tasks</h2>
            <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none">
              All
            </Button>
          </div>
          <div className="space-y-6">
            {tasks.map((task, index) => (
              <div
                key={index}
                className="
                        flex justify-between items-center p-6
                        border-2 border-primary rounded-lg
                        bg-[#E0FFE8] cursor-pointer
                        transition-all duration-200
                        hover:-translate-x-1
                        hover:shadow-none
                        shadow-shadow
                      "
                onClick={() => navigate("/task/" + task.id)}
              >
                <div>
                  <h2 className="text-xl font-bold text-primary">{task.title}</h2>
                  <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                    {task.className}
                  </p>
                </div>

                <Button className="
                        px-5 py-2 border-2 border-black
                        bg-danger text-white rounded-lg font-bold
                        shadow-[-3px_4px_0px_0px_black]
                        hover:translate-y-[2px] hover:shadow-none
                        transition-all
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
