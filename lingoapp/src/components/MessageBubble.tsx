import { Message } from "./ChatInterface";

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
    >
      <div
        className={`max-w-[80%] px-4 py-3 rounded-2xl ${
          message.isUser
            ? 'bg-message-user text-message-user-foreground ml-4'
            : 'bg-message-ai text-message-ai-foreground mr-4'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.text}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </p>
      </div>
    </div>
  );
};