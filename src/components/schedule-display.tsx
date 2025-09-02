'use client';

import type { LectureQueryOutput } from '@/ai/flows/lecture-data-retrieval';
import { Book, Building, Clock, Calendar, User, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

export function ScheduleDisplay({ data }: { data: Required<LectureQueryOutput> }) {
  return (
    <div className="space-y-3">
      {data.schedule.map((lecture, index) => (
        <Card key={index} className="bg-background/50 shadow-md border-border/80 animate-in fade-in-50 slide-in-from-bottom-4 duration-500">
          <CardHeader className="p-4 flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-base font-bold text-primary">
              <Book className="w-5 h-5" />
              <span>{lecture.title}</span>
            </CardTitle>
             <div className="text-xs font-semibold text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {lecture.day}
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-0 grid gap-2 text-sm">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <span>{lecture.professor}</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4 text-muted-foreground" />
              <span>Section: {lecture.section}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>Room: {lecture.roomNo}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{lecture.time}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
