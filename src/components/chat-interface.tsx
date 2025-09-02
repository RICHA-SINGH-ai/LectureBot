"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getLectureScheduleAction } from "@/app/actions";
import type { LectureDataOutput } from "@/ai/flows/lecture-data-retrieval";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { ScheduleDisplay } from "./schedule-display";

const classNameFormSchema = z.object({
  className: z.string().min(2, { message: "Class name must be at least 2 characters." }),
});

const nameFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
});

type Message = {
  id: string;
  sender: "user" | "bot";
  content: React.ReactNode;
};

type ChatStep = "askClassName" | "askName" | "showSchedule" | "loading";

const GenericForm = ({
  onSubmit,
  isPending,
  schema,
  fieldName,
  title,
  description,
  placeholder,
  buttonText
}: {
  onSubmit: (data: any) => void;
  isPending: boolean;
  schema: z.ZodObject<any>;
  fieldName: string;
  title: string;
  description: string;
  placeholder: string;
  buttonText: string;
}) => {
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { [fieldName]: "" },
  });

  return (
    <Card className="shadow-lg border-accent animate-in fade-in-50 duration-500">
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}</FormLabel>
                  <FormControl>
                    <Input placeholder={placeholder} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isPending}>
              {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {buttonText}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatStep, setChatStep] = useState<ChatStep>("askClassName");
  const [studentDetails, setStudentDetails] = useState({ className: "", name: "" });
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([
      {
        id: "intro",
        sender: "bot",
        content: <p>Hello! I am LectureBot. Please provide your class name to get started.</p>,
      },
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isPending, chatStep]);

  const handleClassNameSubmit = (data: z.infer<typeof classNameFormSchema>) => {
    setStudentDetails({ ...studentDetails, className: data.className });
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", content: <p>Class: {data.className}</p> },
      { id: (Date.now() + 1).toString(), sender: "bot", content: <p>Great! Now, please enter your full name.</p> },
    ]);
    setChatStep("askName");
  };

  const handleNameSubmit = (data: z.infer<typeof nameFormSchema>) => {
    const finalDetails = { ...studentDetails, name: data.name };
    setStudentDetails(finalDetails);
    
    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), sender: "user", content: <p>Name: {data.name}</p> },
    ]);
    
    setChatStep("loading");

    startTransition(async () => {
      const result = await getLectureScheduleAction(finalDetails);
      if (result.success && result.schedule) {
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            sender: "bot",
            content: <ScheduleDisplay data={result.schedule as LectureDataOutput} />,
          },
        ]);
        setChatStep("showSchedule");
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error,
        });
        setMessages((prev) => prev.slice(0, prev.length -1)); // remove user name
        setChatStep("askName"); // let them try again
      }
    });
  };
  
  const resetChat = () => {
     setStudentDetails({ className: "", name: "" });
     setChatStep("askClassName");
     setMessages([
      {
        id: "intro-reset",
        sender: "bot",
        content: <p>You can enter a new class name to get another schedule.</p>,
      },
    ]);
  }
  
  const renderForm = () => {
    switch (chatStep) {
      case "askClassName":
        return <GenericForm
          onSubmit={handleClassNameSubmit}
          isPending={isPending}
          schema={classNameFormSchema}
          fieldName="className"
          title="Class Details"
          description="Enter your class name to proceed."
          placeholder="e.g., MCA, BBA001"
          buttonText="Submit Class"
        />
      case "askName":
        return <GenericForm
          onSubmit={handleNameSubmit}
          isPending={isPending}
          schema={nameFormSchema}
          fieldName="name"
          title="Student Details"
          description="Enter your full name."
          placeholder="John Doe"
          buttonText="Get Lecture Schedule"
        />
      default:
        return null;
    }
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
                  "max-w-[85%] sm:max-w-[75%] rounded-xl p-3 shadow-sm",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground gradient-border-bg"
                    : "bg-muted text-foreground gradient-border-bg"
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
          {chatStep !== 'showSchedule' && chatStep !== 'loading' && (
            <div className="flex justify-center pt-4">
                <div className="w-full max-w-sm">
                    {renderForm()}
                </div>
            </div>
          )}
          {chatStep === 'loading' && (
             <div className="flex items-start gap-3 animate-in fade-in-25 duration-300">
               <Avatar className="w-8 h-8 border-2 border-primary shrink-0">
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   <Bot size={18} />
                 </AvatarFallback>
               </Avatar>
               <div className="bg-muted rounded-xl p-3 shadow-sm flex items-center space-x-2 gradient-border-bg">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  <span className="text-muted-foreground italic">Fetching schedule...</span>
               </div>
             </div>
          )}
          {chatStep === 'showSchedule' && !isPending && (
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
