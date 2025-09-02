
"use client";

// Yeh component chat ka pura UI aur logic handle karta hai.

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getLectureScheduleAction } from "@/app/actions";
import type { LectureQueryOutput } from "@/ai/flows/lecture-data-retrieval";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScheduleDisplay } from "./schedule-display";
import { Badge } from "./ui/badge";
import type { Language } from "@/app/page";
import { NotificationReminder } from "./notification-reminder";

// Form validation ke liye schema. Query empty nahi ho sakti.
const chatFormSchema = z.object({
  query: z.string().min(1, { message: "Message cannot be empty." }),
});

// Har message ka structure kaisa hoga.
type Message = {
  id: string;
  sender: "user" | "bot";
  content: React.ReactNode;
};

// Start mein dikhane ke liye example prompts.
const examplePrompts = {
  en: [
    "What is today's schedule for section A?",
    "When is MMP mam's lecture?",
    "MCA-3003",
  ],
  hi: [
    "आज सेक्शन A का शेड्यूल क्या है?",
    "MMP मैम का लेक्चर कब है?",
    "MCA-3003",
  ]
};

// UI ke text, language ke hisaab se.
const uiContent = {
  en: {
    intro: "Hello! I am LectureBot. How can I help you with your schedule today? You can ask me in English or Hindi.",
    placeholder: "Ask about your lectures...",
    thinking: "Thinking...",
  },
  hi: {
    intro: "नमस्ते! मैं लेक्चरबॉट हूँ। मैं आज आपके शेड्यूल में कैसे मदद कर सकता हूँ? आप मुझसे अंग्रेजी या हिंदी में पूछ सकते हैं।",
    placeholder: "अपने व्याख्यानों के बारे में पूछें...",
    thinking: "सोच रहा हूँ...",
  },
}

export default function ChatInterface({ language }: { language: Language }) {
  // Sabhi messages ko store karne ke liye state.
  const [messages, setMessages] = useState<Message[]>([]);
  // Loading state handle karne ke liye. Jab AI se response aa raha ho, isPending true hoga.
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  // Scroll ko automatically neeche karne ke liye ref.
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // React Hook Form ka istemal form management ke liye.
  const form = useForm<z.infer<typeof chatFormSchema>>({
    resolver: zodResolver(chatFormSchema),
    defaultValues: { query: "" },
  });

  // Jab bhi language change ho, intro message update karo.
  useEffect(() => {
    setMessages([
      {
        id: "intro",
        sender: "bot",
        content: <p>{uiContent[language].intro}</p>,
      },
    ]);
  }, [language]);

  // Jab bhi naya message aaye ya AI soch raha ho, to neeche scroll karo.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  // Jab user form submit karega, yeh function call hoga.
  const handleQuerySubmit = (data: z.infer<typeof chatFormSchema>) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: <p>{data.query}</p>
    };

    setMessages(prev => [...prev, userMessage]);
    form.reset();

    // `startTransition` ke andar API call karne se UI block nahi hota.
    startTransition(async () => {
      // Timezone bug ko fix karne ke liye client-side se current day bhej rahe hain.
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const currentDay = days[new Date().getDay()];

      // Server action ko call karke AI se response manga ja raha hai.
      const result = await getLectureScheduleAction({ query: data.query, language, currentDay });
      
      if (result.success && result.response) {
        // Agar response successful hai, toh bot ka message display karo.
        const botResponse = result.response;
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: "bot",
          content: (
            <>
              <p>{botResponse.response}</p>
              {/* Agar schedule data hai, toh use ScheduleDisplay component se dikhao. */}
              {botResponse.schedule && botResponse.schedule.length > 0 && (
                <div className="mt-4">
                  <ScheduleDisplay data={botResponse as Required<LectureQueryOutput>} />
                </div>
              )}
            </>
          ),
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Agar error aaya, toh toast notification dikhao.
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "An unknown error occurred.",
        });
        setMessages(prev => prev.filter(m => m.id !== userMessage.id));
      }
    });
  };

  // Jab user example prompt par click karta hai.
  const handleExamplePromptClick = (prompt: string) => {
    form.setValue("query", prompt);
    form.handleSubmit(handleQuerySubmit)();
  };
  
  return (
    <div className="flex flex-col flex-1 bg-card rounded-b-lg overflow-hidden">
      {/* Notification reminder component */}
      <NotificationReminder />
      
      {/* Chat messages ka area */}
      <div className="flex-1 overflow-y-auto">
        <ScrollArea className="h-full">
          <div className="space-y-6 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500",
                  message.sender === "user" ? "justify-end" : ""
                )}
              >
                {message.sender === "bot" && (
                  <Avatar className="w-8 h-8 border-2 border-primary shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[85%] sm:max-w-[75%] rounded-xl p-3 shadow-sm",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                  )}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <Avatar className="w-8 h-8 border-2 border-accent shrink-0">
                     <AvatarFallback className="bg-accent text-accent-foreground">
                      <User size={18} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {/* Jab AI response generate kar raha ho, toh "Thinking..." indicator dikhao. */}
            {isPending && (
               <div className="flex items-start gap-3 animate-in fade-in duration-300">
                 <Avatar className="w-8 h-8 border-2 border-primary shrink-0">
                   <AvatarFallback className="bg-primary text-primary-foreground">
                     <Bot size={18} />
                   </AvatarFallback>
                 </Avatar>
                 <div className="bg-muted rounded-xl p-3 shadow-sm flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    <span className="text-muted-foreground italic">{uiContent[language].thinking}</span>
                 </div>
               </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input area, jahan user type karta hai */}
      <div className="p-4 bg-card border-t">
         {/* Agar chat shuru nahi hui hai, toh example prompts dikhao. */}
         {!isPending && messages.length <= 2 && (
            <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
                {examplePrompts[language].map((prompt, i) => (
                    <Badge 
                        key={i} 
                        variant="outline" 
                        className="cursor-pointer hover:bg-muted"
                        onClick={() => handleExamplePromptClick(prompt)}
                    >
                        {prompt}
                    </Badge>
                ))}
            </div>
         )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleQuerySubmit)} className="flex items-center gap-2">
            <FormField
              control={form.control}
              name="query"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormControl>
                    <Input placeholder={uiContent[language].placeholder} {...field} disabled={isPending} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" size="icon" className="bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
