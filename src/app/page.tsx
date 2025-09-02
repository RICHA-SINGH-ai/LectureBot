
'use client';

// Yeh humara main page component hai. "use client" ka matlab hai ki yeh component browser mein render hoga.

import ChatInterface from '@/components/chat-interface';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/theme-toggle';
import { BookOpenCheck } from 'lucide-react';

// Language ke liye type define kar rahe hain, ya to 'en' (English) ya 'hi' (Hindi).
export type Language = 'en' | 'hi';

export default function Home() {
  // 'language' state ko manage karne ke liye useState hook ka istemal. Default language 'en' hai.
  const [language, setLanguage] = useState<Language>('en');

  // UI ke text ko language ke hisab se manage karne ke liye ek object.
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
    // Yeh main container hai jo screen ke center mein hai.
    <div className="flex min-h-screen bg-secondary items-center justify-center p-2 sm:p-4">
      {/* Yeh chat window ka container hai, jisme gradient border aur fade-in animation hai. */}
      <div className="w-full max-w-2xl h-[95vh] flex flex-col shadow-2xl rounded-lg bg-background gradient-border-bg animate-in fade-in duration-500">
        
        {/* Header section jisme logo, title, aur language/theme toggles hain. */}
        <header className="flex items-center justify-between gap-4 p-4 border-b bg-card rounded-t-lg">
          <div className="flex items-center gap-4">
            
            {/* Logo, jisme pulse animation hai. */}
            <div className="relative p-2 rounded-full">
              <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full -z-10 animate-pulse-slow"></div>
              <BookOpenCheck className="w-8 h-8 dark:text-white text-black" />
            </div>

            {/* Title aur Subtitle */}
            <div>
              <h1 className="text-2xl font-bold font-headline text-primary">{content[language].title}</h1>
              <p className="text-sm text-muted-foreground">{content[language].subtitle}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">

            {/* Language switcher (EN/HI) */}
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
            
            {/* Theme toggle (Light/Dark mode) */}
            <ThemeToggle />
          </div>
        </header>
        
        {/* ChatInterface component, jisko humne 'language' prop pass kiya hai. */}
        <ChatInterface language={language} />
      </div>
    </div>
  );
}
