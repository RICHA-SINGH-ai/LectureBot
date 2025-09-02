
'use client';

import ChatInterface from '@/components/chat-interface';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpenCheck } from 'lucide-react';

export type Language = 'en' | 'hi';

export default function Home() {
  const [language, setLanguage] = useState<Language>('en');

  const content = {
    en: {
      title: 'LectureBot',
      subtitle: 'Your AI Lecture Assistant',
    },
    hi: {
      title: 'लेक्चरबॉट',
      subtitle: 'आपका AI लेक्चर सहायक',
    },
  };

  return (
    <div className="flex min-h-screen bg-secondary items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl min-h-[90vh] flex flex-col shadow-2xl rounded-lg bg-background gradient-border-bg animate-in fade-in duration-500">
        <header className="flex items-center justify-between gap-4 p-4 border-b bg-card rounded-t-lg">
          <div className="flex items-center gap-4">
            <div className="relative p-2 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full -z-10 animate-pulse-slow"></div>
              <BookOpenCheck className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary">{content[language].title}</h1>
              <p className="text-sm text-muted-foreground">{content[language].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 border rounded-md p-1">
              <Button
                size="sm"
                variant={language === 'en' ? 'secondary' : 'ghost'}
                className={cn("h-7 px-2", language === 'en' ? 'shadow-sm' : '')}
                onClick={() => setLanguage('en')}
              >
                EN
              </Button>
              <Button
                size="sm"
                variant={language === 'hi' ? 'secondary' : 'ghost'}
                className={cn("h-7 px-2", language === 'hi' ? 'shadow-sm' : '')}
                onClick={() => setLanguage('hi')}
              >
                HI
              </Button>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <ChatInterface language={language} />
      </div>
    </div>
  );
}
