
'use client';

import { useState, useEffect } from 'react';
import { scheduleData } from '@/lib/schedule-data';
import { Bell, Clock, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lecture {
  day: string;
  section: 'A' | 'B';
  room: string;
  time: string;
  course: string;
  professor: string;
  title: string;
  startTimeInMinutes: number;
}

const calculateTimeLeft = (lectureStartTimeInMinutes: number) => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const diffInMinutes = lectureStartTimeInMinutes - currentTimeInMinutes;

    if (diffInMinutes <= 5 && diffInMinutes > 0) {
        return "starting soon";
    }
    if (diffInMinutes <= 0) {
        return "starting now";
    }

    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    let timeLeftStr = "in ";
    if (hours > 0) {
        timeLeftStr += `${hours} hr `;
    }
    if (minutes > 0) {
        timeLeftStr += `${minutes} min`;
    }
    return timeLeftStr.trim();
};

const parseTimeToMinutes = (timeStr: string): number => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    // Convert to 24-hour format if period (AM/PM) is provided
    if (period) {
      if (period.toLowerCase() === 'pm' && hours < 12) {
        hours += 12;
      }
      if (period.toLowerCase() === 'am' && hours === 12) { // Midnight case
        hours = 0;
      }
    }
    
    // Fallback for times like '01:00' which are afternoon in the schedule
    if (!period && hours >= 1 && hours <= 5) {
        hours += 12;
    }

    return hours * 60 + minutes;
  };

export function NotificationReminder() {
  const [nextLecture, setNextLecture] = useState<Lecture | null>(null);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const currentDay = days[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes from midnight

    const todaysLectures = scheduleData.schedule
      .filter((lec) => lec.day === currentDay)
      .map((lec) => {
        const startTimeStr = lec.time.split(' - ')[0];
        const startTimeInMinutes = parseTimeToMinutes(startTimeStr);
        return { ...lec, startTimeInMinutes };
      })
      .sort((a, b) => a.startTimeInMinutes - b.startTimeInMinutes);

    const upcomingLecture = todaysLectures.find(lec => lec.startTimeInMinutes > currentTime);

    if (upcomingLecture) {
      setNextLecture(upcomingLecture);
      setTimeLeft(calculateTimeLeft(upcomingLecture.startTimeInMinutes));
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setNextLecture(null);
    }
  }, []);

  useEffect(() => {
    if (!nextLecture) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(nextLecture.startTimeInMinutes));
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [nextLecture]);

  if (!nextLecture || !isVisible) {
    return null;
  }

  return (
    <div 
        className={cn(
            "p-3 border-b bg-secondary/50 text-secondary-foreground animate-in fade-in-0 slide-in-from-top-4 duration-500",
        )}
    >
      <div className="container mx-auto flex items-center justify-center flex-wrap gap-x-3 gap-y-1 text-sm font-medium">
        <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-accent shrink-0" />
            <span className='hidden sm:inline'>Next up:</span>
            <span className="font-semibold">{nextLecture.title}</span>
            <span className="text-muted-foreground">(Sec: {nextLecture.section})</span>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
             <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{nextLecture.day}</span>
            </div>
            <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{nextLecture.time.split(' - ')[0]}</span>
            </div>
        </div>
        <div className="font-semibold text-accent ml-auto sm:ml-0">
            {timeLeft}
        </div>
      </div>
    </div>
  );
}
