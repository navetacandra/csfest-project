import "./App.css"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"
import ClassesPage from "./pages/ClassesPage"
import TasksPage from "./pages/TasksPage"
import NewsDetailPage from "./pages/NewsDetailPage"
import ClassPage from "./pages/ClassPage"
import Header from "./components/layout/Header"
import PresenceRecapPage from "./pages/PresenceRecapPage"
import PresenceAsLecturerPage from "./pages/PresenceAsLecturerPage"
import TaskDetailPage from "./pages/TaskDetailPage"

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <DashboardPage />
              </div>
            </>
          }
        />
        <Route
          path="/classes"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <ClassesPage />
              </div>
            </>
          }
        />
        <Route
          path="/tasks"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <TasksPage />
              </div>
            </>
          }
        />
        <Route
          path="/task/:id"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <TaskDetailPage />
              </div>
            </>
          }
        />
        <Route
          path="/presence"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <PresenceRecapPage />
              </div>
            </>
          }
        />
        <Route
          path="/news-detail"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <NewsDetailPage />
              </div>
            </>
          }
        />
        <Route
          path="/class"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <ClassPage />
              </div>
            </>
          }
        />
        <Route
          path="/presence-as-lecturer"
          element={
            <>
              <div className="container mx-auto">
                <Header />
                <PresenceAsLecturerPage />
              </div>
            </>
          }
        />
      </Routes>
    </Router>
  )
}

export default App
