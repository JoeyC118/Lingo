import { useState, useEffect, useRef } from "react";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { Card } from "@/components/ui/card";
import { sendMessageToServer, getConjugationChart } from "@/lib/api";

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  onFirstMessage: () => void;
  isCompactMode?: boolean;
  setChart: React.Dispatch<React.SetStateAction<string>>;
  setWords: React.Dispatch<React.SetStateAction<string[]>>;
}

export const ChatInterface = ({
  onFirstMessage,
  setWords,
  isCompactMode = false,
  setChart,
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    const tempId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      { id: tempId, text: "…", isUser: false, timestamp: new Date() },
    ]);

    console.log("Sending to API");

    getConjugationChart(text)
      .then((chartMessage) => {
        if (typeof chartMessage === "string" && chartMessage.trim().length > 0) {
          setChart(chartMessage);
        } else {
          setChart("**No chart returned.**");
        }
      })
      .catch((err) => {
        console.error("Chart fetch error:", err);
        setChart("**Error fetching chart.**");
      });

    const { reply, keywords } = await sendMessageToServer(text);

    setMessages((prev) =>
      prev.map((m) =>
        m.id === tempId ? { ...m, text: reply, timestamp: new Date() } : m
      )
    );

    setWords(keywords ?? []);
  };

  if (!isCompactMode) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <div className="w-full max-w-2xl animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-chat-primary to-chat-accent bg-clip-text text-transparent mb-4">
              Lingo
            </h1>
            <p className="text-xl text-muted-foreground">
              Your intelligent AI assistant
            </p>
          </div>

          <Card className="bg-surface border-border p-6 animate-pulse-glow">
            <div className="space-y-4 overflow-y-auto max-h-[70vh]">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} />
              ))}
              {/* 👇 Always scrolls here */}
              <div ref={messagesEndRef} />
            </div>
            <div className="mt-6">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <Card className="h-full bg-surface border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">Chat</h2>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
        {/* 👇 Always scrolls here */}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border">
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </Card>
  );
};
