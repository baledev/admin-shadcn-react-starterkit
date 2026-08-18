import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import { IconPlus } from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import { TeamDataTable } from "@/components/team-data-table"
import {
  type TeamMember,
  type TeamRole,
  ROLE_OPTIONS,
  initialTeamMembers,
} from "@/lib/team-data"
import { Button } from "@workspace/ui/components/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const Route = createFileRoute("/_auth/team")({
  component: TeamPage,
})

// ─── Invite Dialog ────────────────────────────────────────────────────────────

interface InviteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInvite: (email: string, role: TeamRole) => void
}

function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<TeamRole>("member")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    onInvite(email, role)
    setEmail("")
    setRole("member")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Invite Member</DialogTitle>
            <DialogDescription>
              Send an invitation to join your workspace.
            </DialogDescription>
          </DialogHeader>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Email Address</Label>
            <Input
              id="invite-email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Workspace Role</Label>
            <Select
              value={role}
              onValueChange={(v) => setRole(v as TeamRole)}
            >
              <SelectTrigger id="invite-role">
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {ROLE_OPTIONS.filter((opt) => opt.value !== "owner").map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Send Invite</Button>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function TeamPage() {
  const [members, setMembers] = React.useState<TeamMember[]>(initialTeamMembers)
  const [inviteOpen, setInviteOpen] = React.useState(false)

  function handleInvite(email: string, role: TeamRole) {
    // Generate simple name from email
    const namePart = email.split("@")[0]
    const name = namePart.charAt(0).toUpperCase() + namePart.slice(1)

    const newMember: TeamMember = {
      id: `USR-${String(members.length + 1).padStart(3, "0")}`,
      name,
      email,
      role,
      status: "invited",
      lastActiveAt: new Date().toISOString(),
      joinedAt: new Date().toISOString().slice(0, 10),
    }

    setMembers((prev) => [newMember, ...prev])
  }

  function handleChangeRole(member: TeamMember, newRole: TeamRole) {
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, role: newRole } : m))
    )
  }

  function handleToggleStatus(member: TeamMember) {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id !== member.id) return m
        const newStatus = m.status === "deactivated" ? "active" : "deactivated"
        return { ...m, status: newStatus }
      })
    )
  }

  function handleRemove(member: TeamMember) {
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Team"
            description="Manage internal members, roles, and status."
          >
            <Button size="sm" onClick={() => setInviteOpen(true)}>
              <IconPlus className="size-4" aria-hidden="true" />
              Invite Member
            </Button>
          </PageHeader>

          <TeamDataTable
            data={members}
            onChangeRole={handleChangeRole}
            onToggleStatus={handleToggleStatus}
            onRemove={handleRemove}
          />
        </div>
      </div>

      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
      />
    </div>
  )
}
