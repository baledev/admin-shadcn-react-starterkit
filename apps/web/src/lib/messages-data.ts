// ─── Types ────────────────────────────────────────────────────────────────────

export type Message = {
  id: string
  senderId: string
  senderName: string
  senderAvatar?: string
  body: string
  sentAt: string // ISO date string
  isOwn: boolean // true = current user
}

export type Conversation = {
  id: string
  participantName: string
  participantAvatar?: string
  lastMessage: string
  lastMessageAt: string // ISO date string
  unreadCount: number
  messages: Message[]
}

// ─── Static mock data ─────────────────────────────────────────────────────────

export const initialConversations: Conversation[] = [
  {
    id: "conv-1",
    participantName: "Alice Johnson",
    participantAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Sounds good, I will review the new proposal by tomorrow morning.",
    lastMessageAt: "2026-08-18T11:20:00Z",
    unreadCount: 2,
    messages: [
      {
        id: "msg-1-1",
        senderId: "USR-001",
        senderName: "Alice Johnson",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
        body: "Hi! Did you get a chance to check the invoice?",
        sentAt: "2026-08-18T10:00:00Z",
        isOwn: false,
      },
      {
        id: "msg-1-2",
        senderId: "me",
        senderName: "You",
        body: "Yes Alice, we marked it as PAID. Thanks for the quick settlement!",
        sentAt: "2026-08-18T10:15:00Z",
        isOwn: true,
      },
      {
        id: "msg-1-3",
        senderId: "USR-001",
        senderName: "Alice Johnson",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
        body: "Excellent, thanks. Also, did you receive the design files for the new project?",
        sentAt: "2026-08-18T11:10:00Z",
        isOwn: false,
      },
      {
        id: "msg-1-4",
        senderId: "USR-001",
        senderName: "Alice Johnson",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
        body: "Sounds good, I will review the new proposal by tomorrow morning.",
        sentAt: "2026-08-18T11:20:00Z",
        isOwn: false,
      },
    ],
  },
  {
    id: "conv-2",
    participantName: "Bob Martinez",
    participantAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
    lastMessage: "I'll try to pay the overdue invoice by this Friday.",
    lastMessageAt: "2026-08-18T09:12:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg-2-1",
        senderId: "me",
        senderName: "You",
        body: "Hi Bob, just checking in about invoice INV-2026-002 which is overdue.",
        sentAt: "2026-08-18T08:30:00Z",
        isOwn: true,
      },
      {
        id: "msg-2-2",
        senderId: "USR-002",
        senderName: "Bob Martinez",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
        body: "Sorry about that! I've been waiting on a transfer myself. I'll try to pay the overdue invoice by this Friday.",
        sentAt: "2026-08-18T09:12:00Z",
        isOwn: false,
      },
    ],
  },
  {
    id: "conv-3",
    participantName: "Carol White",
    participantAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
    lastMessage: "Let's catch up on Zoom at 2:00 PM.",
    lastMessageAt: "2026-08-17T16:45:00Z",
    unreadCount: 0,
    messages: [
      {
        id: "msg-3-1",
        senderId: "USR-003",
        senderName: "Carol White",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
        body: "Hi, I sent over the updated wireframes for the user settings page.",
        sentAt: "2026-08-17T15:30:00Z",
        isOwn: false,
      },
      {
        id: "msg-3-2",
        senderId: "me",
        senderName: "You",
        body: "Got them, Carol! The settings page looks very clean. Can we do a quick call to walk through billing?",
        sentAt: "2026-08-17T16:15:00Z",
        isOwn: true,
      },
      {
        id: "msg-3-3",
        senderId: "USR-003",
        senderName: "Carol White",
        senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
        body: "Sure, let's catch up on Zoom at 2:00 PM.",
        sentAt: "2026-08-17T16:45:00Z",
        isOwn: false,
      },
    ],
  },
  {
    id: "conv-4",
    participantName: "David Lee",
    lastMessage: "Could you send over the monthly retainer details?",
    lastMessageAt: "2026-08-15T14:30:00Z",
    unreadCount: 1,
    messages: [
      {
        id: "msg-4-1",
        senderId: "USR-004",
        senderName: "David Lee",
        body: "Could you send over the monthly retainer details?",
        sentAt: "2026-08-15T14:30:00Z",
        isOwn: false,
      },
    ],
  },
]
