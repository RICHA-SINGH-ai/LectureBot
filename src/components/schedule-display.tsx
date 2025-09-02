'use client';

import type { LectureDataOutput } from '@/ai/flows/lecture-data-retrieval';
import { Book, Building, Clock, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';

export function ScheduleDisplay({ data }: { data: LectureDataOutput }) {
  return (
    <div className="space-y-4 text-foreground">
      <h2 className="text-lg font-semibold">
        Here is the schedule for <span className="text-primary">{data.studentName}</span>:
      </h2>
      <div className="space-y-3">
        {data.schedule.map((lecture, index) => (
          <Card key={index} className="bg-background/50 shadow-md border-border/80 animate-in fade-in-50 duration-500">
            <CardHeader className="p-4">
              <CardTitle className="flex items-center gap-3 text-base font-bold text-primary">
                <Book className="w-5 h-5" />
                <span>{lecture.title}</span>
              </CardTitle>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 grid gap-2 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{lecture.professor}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>{lecture.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>{lecture.time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
