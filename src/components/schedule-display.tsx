'use client';

import type { LectureDataOutput } from '@/ai/flows/lecture-data-retrieval';
import { Book, Building, Clock, MapPin, User, Info } from 'lucide-react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function ScheduleDisplay({ data }: { data: LectureDataOutput }) {
  const getStatusVariant = (status: string) => {
    if (status.toLowerCase().includes('delayed')) return 'destructive';
    if (status.toLowerCase().includes('on time')) return 'default';
    return 'secondary';
  };

  return (
    <div className="space-y-4 text-foreground">
      <h2 className="text-lg font-semibold">
        Here is the <span className="text-accent">{data.className}</span> schedule for <span className="text-primary">{data.studentName}</span>:
      </h2>
      <div className="space-y-3">
        {data.schedule.map((lecture, index) => (
          <Card key={index} className="bg-background/50 shadow-md border-border/80 animate-in fade-in-50 duration-500">
            <CardHeader className="p-4 flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3 text-base font-bold text-primary">
                <Book className="w-5 h-5" />
                <span>{lecture.title}</span>
              </CardTitle>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant={getStatusVariant(lecture.status)} className="cursor-help">
                      {lecture.status}
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Current lecture status.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardHeader>
            <Separator />
            <CardContent className="p-4 grid gap-2 text-sm">
              <div className="flex items-center gap-3">
                <User className="w-4 h-4 text-muted-foreground" />
                <span>{lecture.professor}</span>
              </div>
              <div className="flex items-center gap-3">
                <Building className="w-4 h-4 text-muted-foreground" />
                <span>Floor: {lecture.floor}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground" />
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
    </div>
  );
}
