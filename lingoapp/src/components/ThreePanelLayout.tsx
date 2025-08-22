import { ChatInterface } from "./ChatInterface";
import { Card } from "@/components/ui/card";
import { Bot, History, Settings } from "lucide-react";

interface ThreePanelLayoutProps {
  onBackToCenter: () => void;
}

export const ThreePanelLayout = ({ onBackToCenter }: ThreePanelLayoutProps) => {
  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="h-[900px] flex gap-4">
        
        {/* Left Panel - Main Chat */}
        <div className="flex-1">
          <ChatInterface onFirstMessage={() => {}} isCompactMode />
        </div>
        
        {/* Right Panels - Stacked */}
        <div className="w-100 flex flex-col gap-4">
          {/* Top Right Panel - Assistant Info */}
          <Card className="flex-1 bg-surface border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-chat-primary/10 rounded-lg">
                <Bot className="h-5 w-5 text-chat-primary" />
              </div>
              <h2 className="text-lg font-semibold text-foreground">Lingo Assistant</h2>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                I'm your AI assistant powered by advanced language models. 
                I can help you with:
              </p>
              <ul className="list-disc list-inside space-y-1">
                <li>Answering questions</li>
                <li>Writing assistance</li>
                <li>Problem solving</li>
                <li>Creative tasks</li>
                <li>Code explanations</li>
              </ul>
              <div className="pt-4 border-t border-border">
                <p className="text-xs text-chat-accent">
                  💡 Tip: Try asking me anything!
                </p>
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