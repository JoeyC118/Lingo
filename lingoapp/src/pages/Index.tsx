import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { ThreePanelLayout } from "@/components/ThreePanelLayout";

const Index = () => {
  const [showThreePanels, setShowThreePanels] = useState(false);

  const handleFirstMessage = () => {
    setTimeout(() => {
      setShowThreePanels(true);
    }, 500);
  };

  if (showThreePanels) {
    return <ThreePanelLayout onBackToCenter={() => setShowThreePanels(false)} />;
  }

  return <ChatInterface onFirstMessage={handleFirstMessage} />;
};

export default Index;
