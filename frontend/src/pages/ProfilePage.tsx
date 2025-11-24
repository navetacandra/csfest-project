import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/profile');
        setProfile(response.data.data);
      } catch (error) {
        console.error('Failed to fetch profile', error);
        // Handle error, maybe redirect to login if unauthorized
      }
    };

    fetchProfile();
  }, []);

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-text-main-light dark:text-text-main-dark min-h-screen font-display">
      <div className="max-w-7xl mx-auto border-3 bg-secondary-background border-border shadow-shadow p-6 rounded-base  dark:border-gray-600 sm:p-8">
        <h1 className="text-4xl font-bold text-primary mb-8">Profile</h1>
        <div className="space-y-4">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {profile.nim && <p><strong>NIM:</strong> {profile.nim}</p>}
          {profile.nip && <p><strong>NIP:</strong> {profile.nip}</p>}
        </div>
        <Button onClick={() => navigate('/dashboard')} className="mt-8">Back to Dashboard</Button>
      </div>
    </div>
  );
};

export default ProfilePage;
