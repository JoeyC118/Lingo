import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ThreePanelLayout } from "@/components/ThreePanelLayout";
import { Navbar } from "@/components/Navbar"; // <- make sure this path matches your file

const Index = () => {
  // set to false if you want to start with the single chat view
  const [showThreePanels, setShowThreePanels] = useState(true);

  const handleFirstMessage = () => {
    setTimeout(() => {
      setShowThreePanels(true);
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {showThreePanels ? (
          <ThreePanelLayout onBackToCenter={() => setShowThreePanels(false)} />
        ) : (
          <ChatInterface onFirstMessage={handleFirstMessage} />
        )}
      </main>
    </div>
  );
};

export default Index;
