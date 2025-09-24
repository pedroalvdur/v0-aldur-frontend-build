import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

interface ChatBubbleProps {
  message: Message
}

export function ChatBubble({ message }: ChatBubbleProps) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3 max-w-[80%]", isUser ? "ml-auto flex-row-reverse" : "mr-auto")}>
      <Avatar className="h-8 w-8 flex-shrink-0">
        <AvatarFallback
          className={cn("text-xs font-medium", isUser ? "bg-primary text-primary-foreground" : "bg-muted")}
        >
          {isUser ? "TU" : "AR"}
        </AvatarFallback>
      </Avatar>

      <div
        className={cn(
          "rounded-lg px-4 py-2 text-sm",
          isUser ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
        )}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <time
          className={cn(
            "text-xs mt-1 block opacity-70",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground/70",
          )}
        >
          {message.timestamp.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </time>
      </div>
    </div>
  )
}
