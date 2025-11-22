import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

const ClassesPage = () => {
  const navigate = useNavigate()
  const classes = [
    { name: "class name here", schedule: "Schedule (day start-end)" },
    { name: "class name here", schedule: "Schedule (day start-end)" },
    { name: "class name here", schedule: "Schedule (day start-end)" },
    { name: "class name here", schedule: "Schedule (day start-end)" },
  ]

  const handleClassClick = () => {
    navigate("/class")
  }

  return (
    <div className="bg-background-light  dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <div className="container mx-auto ">
          <main>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-primary">Your Classes</h1>
              <Button className="bg-green-400 border-2 border-black shadow-[-4px_4px_0px_0px_black] hover:translate-y-1 hover:shadow-none">
                enroll
              </Button>

            </div>
            <div className="space-y-6">
              {classes.map((c, index) => (
                <div
                  key={index}
                  className="
                        flex justify-between items-center p-6 
                        border-2 border-primary rounded-lg 
                        bg-[#E0FFE8] cursor-pointer 
                        transition-all duration-200 
                        hover:-translate-y-1 
                        hover:shadow-shadow
                      "
                  onClick={handleClassClick}
                >
                  <div>
                    <h2 className="text-xl font-bold text-primary">{c.name}</h2>
                    <p className="text-text-secondary-light dark:text-text-secondary-dark mt-1">
                      {c.schedule}
                    </p>
                  </div>

                  <Button className="
                        px-5 py-2 border-2 border-black 
                        bg-danger text-white rounded-lg font-bold 
                        shadow-[-3px_4px_0px_0px_black] 
                        hover:translate-y-[2px] hover:shadow-none 
                        transition-all
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
