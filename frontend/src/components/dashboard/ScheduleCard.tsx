import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Class } from '@/types';
import api from '@/lib/api';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface ScheduleCardProps {
  schedule: Class[];
}

const getDayName = (dayIndex: number) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return days[dayIndex];
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ schedule }) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState<'default' | 'destructive'>('default');

  const displayAlert = (message: string, variant: 'default' | 'destructive') => {
    setAlertMessage(message);
    setAlertVariant(variant);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
      setAlertMessage('');
    }, 3000);
  };

  const handlePresence = async (classId: number) => {
    const today = new Date();
    const scheduleDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    try {
      await api.post(`/presence/${classId}`, {
        classId: classId,
        schedule_date: scheduleDate,
        status: 'hadir',
      });
      displayAlert('Presence recorded successfully!', 'default');
      // Optionally, refetch dashboard data or update local state to reflect the change
    } catch (error) {
      console.error('Failed to record presence', error);
      displayAlert('Failed to record presence.', 'destructive');
    }
  };
  return (
    <div className="lg:col-span-3 bg-secondary-background border-2 border-border shadow-shadow p-6 rounded-base">
      <h2 className="text-xl font-heading mb-4 text-foreground">Schedule</h2>
      {showAlert && (
        <Alert variant={alertVariant} className="mb-4">
          <AlertTitle>{alertVariant === 'destructive' ? 'Error' : 'Success'}</AlertTitle>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}
      <div className="space-y-4 max-h-[250px] overflow-y-auto ps-1 pb-1">
        {schedule.map((item) => {
          const isAttended = item.presence_status === 'hadir';
          return (
                          <div key={item.id} className={`flex justify-between items-center p-4 rounded-base border-2 border-border hover:shadow-none shadow-shadow hover:-translate-x-[2px] transition-all ${isAttended ? 'bg-emerald-100' : 'bg-background'}`}>
                            <div>
                              <p className="font-semibold text-foreground">{item.name}</p>
                              <p className="text-sm text-foreground/80">{getDayName(item.schedule)}, {item.start_time} - {item.end_time}</p>
                            </div>
                            <Button onClick={() => handlePresence(item.id)} disabled={isAttended} variant={isAttended ? 'neutral' : 'default'}>
                              {isAttended ? 'Attended' : 'Presence'}
                            </Button>
                          </div>          );
        })}
      </div>
    </div>
  );
};

export default ScheduleCard;
