import { ChatInterface } from "./ChatInterface";
import { Card } from "@/components/ui/card";
import { Bot, History, Settings } from "lucide-react";
import { useState } from "react"
import ReactMarkdown  from "react-markdown"

interface ThreePanelLayoutProps {
  onBackToCenter: () => void;
}

export const ThreePanelLayout = ({ onBackToCenter }: ThreePanelLayoutProps) => {
  const [chart, setChart] = useState("")
  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="h-[900px] flex gap-4">
        
        {/* Left Panel - Main Chat */}
        <div className="flex-1">
          <ChatInterface setChart = {setChart} onFirstMessage={() => {}} isCompactMode />
        </div>
        
        {/* Right Panels - Stacked */}
        <div className="w-[800px] flex flex-col gap-4">
          {/* Top Right Panel - Assistant Info */}
          <Card className="flex-1 bg-surface border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-chat-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-chat-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Conjugation Chart</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <ReactMarkdown>{chart}</ReactMarkdown>
            <div className="pt-4 border-t border-border">
        
              </div>
            </div>
          </Card>
          
          {/* Bottom Right Panel - Chat History */}
          <Card className="flex-1 bg-surface border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-chat-secondary/10 rounded-lg">
                <History className="h-5 w-5 text-chat-secondary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Recent Chats</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-background rounded-lg border border-border hover:bg-surface-hover transition-colors cursor-pointer">
                <p className="text-sm font-medium text-foreground">Getting Started</p>
                <p className="text-xs text-muted-foreground">Just now</p>
              </div>
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">
                  Your conversation history will appear here
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};