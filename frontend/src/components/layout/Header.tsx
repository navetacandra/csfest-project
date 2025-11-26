import { clearAuth } from '@/lib/auth';
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import api from '@/lib/api';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');

  const handleLogout = async () => {
    try {
      await api.delete('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('loginTimestamp');
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      clearAuth();
      navigate('/login');
    }
  };

  return (
    <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto pt-4 sm:pt-6 lg:pt-8 px-5">
      <div className="text-4xl font-bold text-primary cursor-pointer" onClick={() => {navigate('/dashboard')}}>Ku-LMSin</div>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {userRole === 'admin' && (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>Admin</DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuItem onClick={() => navigate('/admin/majors')}>
                    Major
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/study-programs')}>
                    Study Program
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/dosen')}>
                    Dosen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/mahasiswa')}>
                    Mahasiswa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/news')}>
                    News
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/classes')}>
                    Class
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
            {userRole === 'dosen' && (
              <DropdownMenuItem onClick={() => navigate('/classes')}>
                Classes
              </DropdownMenuItem>
            )}
            {userRole === 'mahasiswa' && (
              <>
                <DropdownMenuItem onClick={() => navigate('/classes')}>
                  Classes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/tasks')}>
                  Tasks
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/presence')}>
                  Presence
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </nav>

      {/* Desktop Navigation */}
      <nav className="hidden md:block">
        <ul className="flex items-center space-x-2 text-lg text-primary">
          {userRole === 'admin' && (
            <li>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="hover:underline">
                    Admin
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => navigate('/admin/majors')}>
                    Major
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/study-programs')}>
                    Study Program
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/dosen')}>
                    Dosen
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/mahasiswa')}>
                    Mahasiswa
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/news')}>
                    News
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/admin/classes')}>
                    Class
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )}
          {userRole === 'dosen' && (
            <li>
              <Button className="hover:underline" onClick={() => {navigate('/classes')}}>
                Classes
              </Button>
            </li>
          )}
          {userRole === 'mahasiswa' && (
            <>
              <li>
                <Button className="hover:underline" onClick={() => {navigate('/classes')}}>
                  Classes
                </Button>
              </li>
              <li>
                <Button className="hover:underline" onClick={() => {navigate('/tasks')}}>
                  Tasks
                </Button>
              </li>
              <li>
                <Button className="hover:underline" onClick={() => {navigate('/presence')}}>
                  Presence
                </Button>
              </li>
            </>
          )}
          <li>
            <Button className="hover:underline" onClick={handleLogout}>
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
