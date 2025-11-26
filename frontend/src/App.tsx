import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import ClassPage from './pages/ClassPage';
import TaskDetailPage from './pages/TaskDetailPage';
import TasksPage from './pages/TasksPage';
import NewsDetailPage from './pages/NewsDetailPage';
import PresenceRecapPage from './pages/PresenceRecapPage';
import PresenceAsLecturerPage from './pages/PresenceAsLecturerPage';
import ProfilePage from './pages/ProfilePage';

// Admin Pages
import MajorsPage from './pages/admin/MajorsPage';
import StudyProgramsPage from './pages/admin/StudyProgramsPage';
import MahasiswaPage from './pages/admin/MahasiswaPage';
import DosenPage from './pages/admin/DosenPage';
import AdminClassesPage from './pages/admin/ClassesPage';
import AdminNewsPage from './pages/admin/NewsPage';

import PrivateRoute from './components/PrivateRoute';
import Layout from './components/layout/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Main App Routes with Layout */}
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="classes" element={<ClassesPage />} />
          <Route path="class/:id" element={<ClassPage />} />
          <Route path="class/:class_id/task/:id" element={<TaskDetailPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="news/:id" element={<NewsDetailPage />} />
          <Route path="presence" element={<PresenceRecapPage />} />
          <Route path="class/:id/presence" element={<PresenceAsLecturerPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route index element={<Navigate to="/dashboard" />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<PrivateRoute role="admin" />}>
          <Route element={<Layout />}>
            <Route path="majors" element={<MajorsPage />} />
            <Route path="study-programs" element={<StudyProgramsPage />} />
            <Route path="mahasiswa" element={<MahasiswaPage />} />
            <Route path="dosen" element={<DosenPage />} />
            <Route path="classes" element={<AdminClassesPage />} />
            <Route path="news" element={<AdminNewsPage />} />
            <Route index element={<Navigate to="/admin/dashboard" />} />
          </Route>
        </Route>

      </Routes>
    </Router>
  );
}

export default App;