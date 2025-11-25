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
import ProfilePage from "./pages/ProfilePage"
import PrivateRoute from "./components/PrivateRoute"

function App() {
  return (
    <Router>
      <Routes >
        <Route path="/" element={<LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route
            path="/dashboard"
            element={
              <>
                <div className="container mx-auto px-4">
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
                <div className="container mx-auto px-4">
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
                <div className="container mx-auto px-4">
                  <Header />
                  <TasksPage />
                </div>
              </>
            }
          />
          <Route
            path="/class/:class_id/task/:id"
            element={
              <>
                <div className="container mx-auto px-4">
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
                <div className="container mx-auto px-4">
                  <Header />
                  <PresenceRecapPage />
                </div>
              </>
            }
          />
          <Route
            path="/news/:id"
            element={
              <>
                <div className="container mx-auto px-4">
                  <Header />
                  <NewsDetailPage />
                </div>
              </>
            }
          />
          <Route
            path="/class/:id"
            element={
              <>
                <div className="container mx-auto px-4">
                  <Header />
                  <ClassPage />
                </div>
              </>
            }
          />
          <Route
            path="/class/:id/presence"
            element={
              <>
                <div className="container mx-auto px-4">
                  <Header />
                  <PresenceAsLecturerPage />
                </div>
              </>
            }
          />
          <Route
            path="/profile"
            element={
              <>
                <div className="container mx-auto px-4">
                  <Header />
                  <ProfilePage />
                </div>
              </>
            }
          />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
