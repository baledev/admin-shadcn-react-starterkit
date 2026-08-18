import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconChevronLeft,
  IconMessage,
  IconSend,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import {
  type Conversation,
  type Message,
  initialConversations,
} from "@/lib/messages-data"
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Textarea } from "@workspace/ui/components/textarea"

export const Route = createFileRoute("/_auth/messages")({
  component: MessagesPage,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatChatTime(dateStr: string) {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr

  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()

  if (isToday) {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MessagesPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>(() =>
    initialConversations.map((c) =>
      c.id === "conv-1" ? { ...c, unreadCount: 0 } : c
    )
  )
  const [activeId, setActiveId] = React.useState<string | null>("conv-1")
  const [composerText, setComposerText] = React.useState("")

  // Scroll to bottom of message thread
  const threadEndRef = React.useRef<HTMLDivElement>(null)

  const activeConversation = React.useMemo(() => {
    return conversations.find((c) => c.id === activeId) || null
  }, [conversations, activeId])

  function handleSelectConversation(id: string) {
    setActiveId(id)
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id && c.unreadCount > 0
          ? { ...c, unreadCount: 0 }
          : c
      )
    )
  }

  // Scroll to bottom when conversation or message changes
  React.useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [activeId, activeConversation?.messages?.length])

  function handleSend() {
    if (!composerText.trim() || !activeId) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      senderId: "me",
      senderName: "You",
      body: composerText.trim(),
      sentAt: new Date().toISOString(),
      isOwn: true,
    }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== activeId) return c
        return {
          ...c,
          lastMessage: newMsg.body,
          lastMessageAt: newMsg.sentAt,
          messages: [...c.messages, newMsg],
        }
      })
    )

    setComposerText("")
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Messages"
            description="Chat with your team members and clients."
          />

          {/* Inbox wrapper */}
          <div className="flex flex-1 overflow-hidden rounded-lg border border-border bg-card min-h-[500px] h-[calc(100vh-12rem)]">
            
            {/* Conversations list panel */}
            <div
              className={`w-full md:w-80 shrink-0 border-r border-border flex flex-col ${
                activeId && "hidden md:flex"
              }`}
            >
              <div className="p-4 border-b border-border font-semibold text-sm">
                Conversations
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-border/60">
                {conversations.map((conv) => {
                  const initials = getInitials(conv.participantName)
                  const isActive = conv.id === activeId
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`w-full text-left p-4 flex gap-3 items-start transition-colors hover:bg-muted/40 ${
                        isActive ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={conv.participantAvatar} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="font-semibold text-sm text-foreground truncate">
                            {conv.participantName}
                          </span>
                          <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">
                            {formatChatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="size-5 shrink-0 p-0 flex items-center justify-center rounded-full text-[10px] font-bold">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Conversation thread panel */}
            <div
              className={`flex-1 flex flex-col bg-muted/10 dark:bg-muted/5 ${
                !activeId && "hidden md:flex"
              }`}
            >
              {activeConversation ? (
                <>
                  {/* Thread Header */}
                  <div className="px-4 h-14 shrink-0 flex items-center gap-3 border-b border-border bg-card">
                    {/* Back button on mobile */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="md:hidden size-8 text-muted-foreground"
                      onClick={() => setActiveId(null)}
                      aria-label="Back to conversations"
                    >
                      <IconChevronLeft className="size-5" />
                    </Button>
                    <Avatar className="size-8">
                      <AvatarImage src={activeConversation.participantAvatar} />
                      <AvatarFallback>
                        {getInitials(activeConversation.participantName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">
                        {activeConversation.participantName}
                      </span>
                      <span className="text-[10px] text-emerald-500 font-medium">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Message Bubble list */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 max-w-[85%] ${
                          msg.isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {!msg.isOwn && (
                          <Avatar className="size-7 mt-0.5 shrink-0">
                            <AvatarImage src={msg.senderAvatar} />
                            <AvatarFallback>
                              {getInitials(msg.senderName)}
                            </AvatarFallback>
                          </Avatar>
                        )}
                        <div className="flex flex-col gap-1">
                          <div
                            className={`rounded-lg px-3 py-2 text-sm leading-relaxed ${
                              msg.isOwn
                                ? "bg-primary text-primary-foreground"
                                : "bg-card border border-border"
                            }`}
                          >
                            {msg.body}
                          </div>
                          <span
                            className={`text-[9px] text-muted-foreground/60 tabular-nums ${
                              msg.isOwn ? "text-right" : "text-left"
                            }`}
                          >
                            {formatChatTime(msg.sentAt)}
                          </span>
                        </div>
                      </div>
                    ))}
                    <div ref={threadEndRef} />
                  </div>

                  {/* Bottom Composer */}
                  <div className="p-3 border-t border-border bg-card flex items-end gap-2">
                    <Textarea
                      placeholder="Type a message..."
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="min-h-9 max-h-24 h-9 resize-none flex-1 py-1.5 px-3"
                    />
                    <Button
                      size="icon"
                      className="size-9 shrink-0"
                      onClick={handleSend}
                      disabled={!composerText.trim()}
                      aria-label="Send message"
                    >
                      <IconSend className="size-4" />
                    </Button>
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8 text-center bg-card">
                  <IconMessage className="size-12 text-muted-foreground/35" />
                  <div>
                    <p className="text-sm font-medium">No conversation selected</p>
                    <p className="text-sm text-muted-foreground">
                      Choose a contact from the left list to start messaging.
                    </p>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}
