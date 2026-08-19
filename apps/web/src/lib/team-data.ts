// ─── Types ────────────────────────────────────────────────────────────────────

export type TeamRole = "owner" | "admin" | "member" | "viewer"
export type MemberStatus = "active" | "invited" | "deactivated"

export type TeamMember = {
  id: string
  name: string
  email: string
  role: TeamRole
  status: MemberStatus
  avatarUrl?: string
  lastActiveAt: string // ISO Date/time or "Just now" / "Offline"
  joinedAt: string // ISO date
}

// ─── Display metadata ─────────────────────────────────────────────────────────

export const ROLE_META: Record<TeamRole, { label: string; chip: string }> = {
  owner: {
    label: "Owner",
    chip: "bg-primary text-primary-foreground",
  },
  admin: {
    label: "Admin",
    chip: "bg-secondary text-secondary-foreground",
  },
  member: {
    label: "Member",
    chip: "border-border text-foreground bg-background",
  },
  viewer: {
    label: "Viewer",
    chip: "border-transparent text-muted-foreground bg-muted/50",
  },
}

export const STATUS_META: Record<
  MemberStatus,
  { label: string; chip: string }
> = {
  active: {
    label: "Active",
    chip: "bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
  },
  invited: {
    label: "Invited",
    chip: "bg-blue-500/15 text-blue-700 ring-blue-500/30 dark:bg-blue-400/15 dark:text-blue-300 dark:ring-blue-400/30",
  },
  deactivated: {
    label: "Deactivated",
    chip: "bg-destructive/15 text-destructive ring-destructive/30",
  },
}

// ─── Options ──────────────────────────────────────────────────────────────────

export const ROLE_OPTIONS: { value: TeamRole; label: string }[] = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "member", label: "Member" },
  { value: "viewer", label: "Viewer" },
]

export const STATUS_OPTIONS: { value: MemberStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "invited", label: "Invited" },
  { value: "deactivated", label: "Deactivated" },
]

// ─── Static data ──────────────────────────────────────────────────────────────

export const initialTeamMembers: TeamMember[] = [
  {
    id: "USR-001",
    name: "Sarah Connor",
    email: "sarah@acme.com",
    role: "owner",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-18T10:15:00Z",
    joinedAt: "2025-01-10",
  },
  {
    id: "USR-002",
    name: "John Connor",
    email: "john@acme.com",
    role: "admin",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-18T09:45:00Z",
    joinedAt: "2025-01-12",
  },
  {
    id: "USR-003",
    name: "Ellen Ripley",
    email: "ripley@acme.com",
    role: "admin",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-17T15:20:00Z",
    joinedAt: "2025-02-14",
  },
  {
    id: "USR-004",
    name: "Marcus Wright",
    email: "marcus@acme.com",
    role: "member",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-18T11:02:00Z",
    joinedAt: "2025-03-01",
  },
  {
    id: "USR-005",
    name: "Kyle Reese",
    email: "kyle@acme.com",
    role: "member",
    status: "invited",
    lastActiveAt: "2026-08-15T08:00:00Z",
    joinedAt: "2026-08-15",
  },
  {
    id: "USR-006",
    name: "Peter Parker",
    email: "spidey@acme.com",
    role: "viewer",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-18T04:30:00Z",
    joinedAt: "2025-06-20",
  },
  {
    id: "USR-007",
    name: "Bruce Wayne",
    email: "batman@acme.com",
    role: "viewer",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-16T22:10:00Z",
    joinedAt: "2025-07-02",
  },
  {
    id: "USR-008",
    name: "Clark Kent",
    email: "supes@acme.com",
    role: "member",
    status: "deactivated",
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-05-12T14:00:00Z",
    joinedAt: "2025-04-11",
  },
  {
    id: "USR-009",
    name: "Diana Prince",
    email: "diana@acme.com",
    role: "member",
    status: "invited",
    lastActiveAt: "2026-08-16T09:00:00Z",
    joinedAt: "2026-08-16",
  },
  {
    id: "USR-010",
    name: "Arthur Curry",
    email: "aquaman@acme.com",
    role: "viewer",
    status: "active",
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=64&h=64&fit=crop&auto=format",
    lastActiveAt: "2026-08-18T08:15:00Z",
    joinedAt: "2025-09-15",
  },
]
