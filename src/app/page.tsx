import ChatInterface from '@/components/chat-interface';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-secondary items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl rounded-lg bg-background">
        <header className="flex items-center gap-4 p-4 border-b bg-card rounded-t-lg">
          <div className="relative p-2 rounded-full text-primary-foreground">
             <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full -z-10 animate-pulse-slow"></div>
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-headline text-primary">LectureBot</h1>
            <p className="text-sm text-muted-foreground">Your AI Lecture Assistant</p>
          </div>
        </header>
        <ChatInterface />
      </div>
    </div>
  );
}
