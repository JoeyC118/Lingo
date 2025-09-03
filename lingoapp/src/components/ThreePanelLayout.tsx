import { ChatInterface } from "./ChatInterface";
import { Card } from "@/components/ui/card";
import { Bot, History, Settings } from "lucide-react";
import { useState } from "react"
import ReactMarkdown  from "react-markdown"

interface ThreePanelLayoutProps {
  onBackToCenter: () => void;
}

const handleAddToWordList = (word: string) => {
  console.log(`Added ${word} to word list`);
  // Later: save to database, state, or another list
};


export const ThreePanelLayout = ({ onBackToCenter }: ThreePanelLayoutProps) => {
  const [chart, setChart] = useState("")
  const [word, setWords] = useState<string[]>([]); 

  return (
    <div className="min-h-screen bg-background p-4 animate-fade-in">
      <div className="h-[900px] flex gap-4">
        
        {/* Left Panel - Main Chat */}
        <div className="flex-1">
          <ChatInterface setChart = {setChart} setWords = {setWords} onFirstMessage={() => {}} isCompactMode />
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
              <h2 className="text-lg font-semibold text-foreground">Keywords</h2>
            </div>

            <div className="space-y-3">
                {word.length > 0 ? (
                  word.map((w, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3 bg-background rounded-lg border border-border"
                    >
                      <p className="text-sm font-medium text-foreground">{w}</p>
                      <button
                        onClick={() => handleAddToWordList(w)}
                        className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition"
                      >
                        Add to Word List
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm text-muted-foreground">
                      Your extracted keywords will appear here
                    </p>
                  </div>
                )}
              </div>
          </Card>

        </div>
      </div>
    </div>
  );
};