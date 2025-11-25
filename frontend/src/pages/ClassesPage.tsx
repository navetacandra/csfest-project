import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import type { Class, ApiResponse } from "@/types"

const getDayName = (dayIndex: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

const ClassesPage = () => {
  const navigate = useNavigate()
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await api.get<ApiResponse<Class[]>>('/classes');
        setClasses(response.data.data);
      } catch (error) {
        console.error('Failed to fetch classes', error);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (id: number) => {
    navigate(`/class/${id}`)
  }

  return (
    <div className="bg-background-light  dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <div className="container mx-auto ">
          <main>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h1 className="text-3xl sm:text-4xl font-bold text-primary">Your Classes</h1>
              <Button className="bg-green-400 border-2 border-black hover:translate-y-1 hover:shadow-none w-full sm:w-auto">
                enroll
              </Button>
            </div>
            <div className="space-y-6">
              {classes.map((c) => (
                <div
                  key={c.id}
                  className="
                        flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 sm:p-6
                        border-2 border-primary rounded-lg 
                        bg-[#E0FFE8] cursor-pointer 
                        transition-all duration-200 
                        hover:-translate-x-1 
                        hover:shadow-none
                        shadow-shadow
                      "
                  onClick={() => handleClassClick(c.id)}
                >
                  <div className="mb-4 sm:mb-0">
                    <h2 className="text-lg sm:text-xl font-bold text-primary">{c.name}</h2>
                    <p className="text-sm sm:text-base text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {getDayName(c.schedule)}, {c.start_time} - {c.end_time}
                    </p>
                  </div>
                  <Button className="
                        px-5 py-2 border-2 border-black 
                        bg-danger text-white rounded-lg font-bold 
                        hover:translate-y-[2px] hover:shadow-none 
                        transition-all w-full sm:w-auto
                      ">
                    unenroll
                  </Button>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default ClassesPage
