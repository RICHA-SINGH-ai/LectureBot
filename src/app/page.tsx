import ChatInterface from '@/components/chat-interface';
import { Bot } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-background items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl h-[95vh] sm:h-[90vh] flex flex-col shadow-2xl rounded-lg">
        <header className="flex items-center gap-4 p-4 border-b bg-card rounded-t-lg">
          <div className="p-2 rounded-full bg-primary/10 text-primary ring-4 ring-primary/20">
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
