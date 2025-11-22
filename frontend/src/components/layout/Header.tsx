import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();

  return (
    <header className="flex justify-between items-center mb-10 max-w-7xl mx-auto pt-4 sm:pt-6 lg:pt-8">
      <div className="text-2xl font-bold text-primary cursor-pointer" onClick={() => {navigate('/dashboard')}}>Ku-LMSin</div>
      <nav>
        <ul className="flex items-center space-x-2 text-lg text-primary">
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
          <li>
            <Button className="hover:underline" >
              Logout
            </Button>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header;
