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

function MarkdownRenderer({ content }: { content: string }) {
  // Split content by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g)

  return (
    <div className="space-y-2">
      {parts.map((part, index) => {
        // Handle code blocks
        if (part.startsWith("```") && part.endsWith("```")) {
          const codeContent = part.slice(3, -3).trim()
          return (
            <pre key={index} className="bg-black/10 rounded p-2 text-xs overflow-x-auto">
              <code>{codeContent}</code>
            </pre>
          )
        }

        // Handle regular text with basic markdown
        const lines = part.split("\n")
        return (
          <div key={index} className="space-y-1">
            {lines.map((line, lineIndex) => {
              // Handle numbered lists
              if (/^\d+\.\s/.test(line)) {
                const content = line.replace(/^\d+\.\s/, "")
                const formattedContent = formatInlineMarkdown(content)
                return (
                  <div key={lineIndex} className="flex gap-2">
                    <span className="font-medium text-primary">{line.match(/^\d+/)?.[0]}.</span>
                    <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
                  </div>
                )
              }

              // Handle bullet points
              if (line.startsWith("- ") || line.startsWith("• ")) {
                const content = line.replace(/^[-•]\s/, "")
                const formattedContent = formatInlineMarkdown(content)
                return (
                  <div key={lineIndex} className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span dangerouslySetInnerHTML={{ __html: formattedContent }} />
                  </div>
                )
              }

              // Handle headers
              if (line.startsWith("## ")) {
                return (
                  <h3 key={lineIndex} className="font-semibold text-base mt-3 mb-1">
                    {line.slice(3)}
                  </h3>
                )
              }
              if (line.startsWith("# ")) {
                return (
                  <h2 key={lineIndex} className="font-bold text-lg mt-3 mb-1">
                    {line.slice(2)}
                  </h2>
                )
              }

              // Handle regular paragraphs
              if (line.trim()) {
                const formattedContent = formatInlineMarkdown(line)
                return <p key={lineIndex} dangerouslySetInnerHTML={{ __html: formattedContent }} />
              }

              // Empty lines
              return <br key={lineIndex} />
            })}
          </div>
        )
      })}
    </div>
  )
}

function formatInlineMarkdown(text: string): string {
  return (
    text
      // Bold text **text**
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic text *text*
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Inline code `code`
      .replace(/`([^`]+)`/g, '<code class="bg-black/10 px-1 py-0.5 rounded text-xs">$1</code>')
  )
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
        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content} />
        )}
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
