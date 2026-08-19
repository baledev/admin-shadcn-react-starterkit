import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { IconChevronLeft, IconMessage, IconSend } from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import {
  type Conversation,
  type Message,
  initialConversations,
} from "@/lib/messages-data"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
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
        c.id === id && c.unreadCount > 0 ? { ...c, unreadCount: 0 } : c
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
    <div className="flex h-full flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-1 flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Messages"
            description="Chat with your team members and clients."
          />

          {/* Inbox wrapper */}
          <div className="flex h-[calc(100vh-12rem)] min-h-[500px] flex-1 overflow-hidden rounded-lg border border-border bg-card">
            {/* Conversations list panel */}
            <div
              className={`flex w-full shrink-0 flex-col border-r border-border md:w-80 ${
                activeId && "hidden md:flex"
              }`}
            >
              <div className="border-b border-border p-4 text-sm font-semibold">
                Conversations
              </div>
              <div className="flex-1 divide-y divide-border/60 overflow-y-auto">
                {conversations.map((conv) => {
                  const initials = getInitials(conv.participantName)
                  const isActive = conv.id === activeId
                  return (
                    <button
                      key={conv.id}
                      type="button"
                      onClick={() => handleSelectConversation(conv.id)}
                      className={`flex w-full items-start gap-3 p-4 text-left transition-colors hover:bg-muted/40 ${
                        isActive ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={conv.participantAvatar} />
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <span className="truncate text-sm font-semibold text-foreground">
                            {conv.participantName}
                          </span>
                          <span className="text-[10px] whitespace-nowrap text-muted-foreground tabular-nums">
                            {formatChatTime(conv.lastMessageAt)}
                          </span>
                        </div>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {conv.lastMessage}
                        </p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="flex size-5 shrink-0 items-center justify-center rounded-full p-0 text-[10px] font-bold">
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
              className={`flex flex-1 flex-col bg-muted/10 dark:bg-muted/5 ${
                !activeId && "hidden md:flex"
              }`}
            >
              {activeConversation ? (
                <>
                  {/* Thread Header */}
                  <div className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4">
                    {/* Back button on mobile */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-muted-foreground md:hidden"
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
                      <span className="text-sm font-semibold">
                        {activeConversation.participantName}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-500">
                        Online
                      </span>
                    </div>
                  </div>

                  {/* Message Bubble list */}
                  <div className="flex-1 space-y-4 overflow-y-auto p-4">
                    {activeConversation.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex max-w-[85%] gap-3 ${
                          msg.isOwn ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {!msg.isOwn && (
                          <Avatar className="mt-0.5 size-7 shrink-0">
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
                                : "border border-border bg-card"
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
                  <div className="flex items-end gap-2 border-t border-border bg-card p-3">
                    <Textarea
                      placeholder="Type a message..."
                      value={composerText}
                      onChange={(e) => setComposerText(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="h-9 max-h-24 min-h-9 flex-1 resize-none px-3 py-1.5"
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
                <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-card p-8 text-center">
                  <IconMessage className="size-12 text-muted-foreground/35" />
                  <div>
                    <p className="text-sm font-medium">
                      No conversation selected
                    </p>
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
