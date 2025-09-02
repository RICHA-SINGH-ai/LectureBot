
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
  professor: string[];
  title: string;
  startTimeInMinutes: number;
}

const calculateTimeLeft = (lectureStartTimeInMinutes: number) => {
    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
    const diffInMinutes = lectureStartTimeInMinutes - currentTimeInMinutes;

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
        const timeParts = lec.time.split(' - ')[0].split(':');
        const startHour = parseInt(timeParts[0], 10);
        const startMinute = parseInt(timeParts[1], 10);
        const startTimeInMinutes = startHour * 60 + startMinute;
        return { ...lec, startTimeInMinutes };
      })
      .sort((a, b) => a.startTimeInMinutes - b.startTimeInMinutes);

    const upcomingLecture = todaysLectures.find(lec => lec.startTimeInMinutes > currentTime);

    if (upcomingLecture) {
      setNextLecture(upcomingLecture);
      setTimeLeft(calculateTimeLeft(upcomingLecture.startTimeInMinutes));
      setIsVisible(true);
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
        <div className="ml-auto font-semibold text-accent">
            {timeLeft}
        </div>
      </div>
    </div>
  );
}
