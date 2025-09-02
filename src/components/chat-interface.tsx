"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getLectureScheduleAction } from "@/app/actions";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  id: z.string().min(1, { message: "Student ID cannot be empty." }),
});

type Message = {
  id: string;
  sender: "user" | "bot";
  content: React.ReactNode;
};

const StudentDetailsForm = ({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: z.infer<typeof formSchema>) => void;
  isPending: boolean;
}) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", id: "" },
  });

  return (
    <Card className="shadow-lg border-accent animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline">Student Details</CardTitle>
        <CardDescription>Enter your details to proceed.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 12345" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Send className="mr-2 h-4 w-4" />
              )}
              Get Lecture Schedule
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [detailsSubmitted, setDetailsSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "intro",
        sender: "bot",
        content: (
          <p>
            Hello! I am LectureBot. Please provide your name and student ID to
            get your current lecture schedule.
          </p>
        ),
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending]);

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    const userMessageContent = (
      <div>
        <p className="font-medium">My Details:</p>
        <p>Name: {data.name}</p>
        <p>ID: {data.id}</p>
      </div>
    );
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", content: userMessageContent },
    ]);
    
    setDetailsSubmitted(true);

    startTransition(async () => {
      const result = await getLectureScheduleAction(data);
      if (result.success && result.schedule) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            content: <pre className="whitespace-pre-wrap font-sans text-sm">{result.schedule}</pre>,
          },
        ]);
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
        setMessages((prev) => prev.slice(0, prev.length -1));
        setDetailsSubmitted(false);
      }
    });
  };
  
  const resetChat = () => {
     setDetailsSubmitted(false);
     setMessages([
      {
        id: "intro-reset",
        sender: "bot",
        content: (
          <p>
            You can enter new details to get another schedule.
          </p>
        ),
      },
    ]);
  }

  return (
    <div className="flex flex-col flex-1 bg-card rounded-b-lg border border-t-0 overflow-hidden">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3 animate-in fade-in-25 duration-300",
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
                  "max-w-[85%] sm:max-w-[75%] rounded-lg p-3 shadow-sm",
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
          {!detailsSubmitted && (
            <div className="flex justify-center pt-4">
                <div className="w-full max-w-sm">
                    <StudentDetailsForm onSubmit={handleSubmit} isPending={isPending} />
                </div>
            </div>
          )}
          {isPending && detailsSubmitted && (
             <div className="flex items-start gap-3 animate-in fade-in-25 duration-300">
               <Avatar className="w-8 h-8 border-2 border-primary shrink-0">
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   <Bot size={18} />
                 </AvatarFallback>
               </Avatar>
               <div className="bg-muted rounded-lg p-3 shadow-sm flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground italic">Fetching schedule...</span>
               </div>
             </div>
          )}
          {detailsSubmitted && !isPending && messages.some(m => m.sender === 'user') && (
             <div className="flex justify-center pt-4 animate-in fade-in-50 duration-500">
                <Button variant="outline" onClick={resetChat}>Start Over</Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
    </div>
  );
}
