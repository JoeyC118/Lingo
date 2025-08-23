import { Message } from "./ChatInterface";
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"


interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble = ({ message }: MessageBubbleProps) => {
  return (
    <div
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-slide-in`}
    >
      <div
        className={`max-w-[90%] px-8 py-4 rounded-2xl ${
          message.isUser
            ? 'bg-message-user text-message-user-foreground ml-4'
            : 'bg-message-ai text-message-ai-foreground mr-4'
        }`}
      >
        <div className="text-lg leading-relaxed prose prose-lg dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {message.text}
          </ReactMarkdown>
        </div>


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