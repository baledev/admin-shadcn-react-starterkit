import * as React from "react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import {
  IconActivity,
  IconCalendar,
  IconDeviceLaptop,
  IconEdit,
  IconMail,
  IconMapPin,
  IconShield,
  IconUser,
} from "@tabler/icons-react"
import { toast } from "sonner"

import { PageHeader } from "@/components/page-header"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Textarea } from "@workspace/ui/components/textarea"

export const Route = createFileRoute("/_auth/profile")({
  component: ProfilePage,
})

// ─── Mock Activities ──────────────────────────────────────────────────────────

const MOCK_ACTIVITIES = [
  {
    id: "act-1",
    action: "Updated settings configuration",
    device: "Chrome on macOS",
    time: "10 mins ago",
    icon: <IconSettings className="size-4" />,
  },
  {
    id: "act-2",
    action: "LoggedIn successfully",
    device: "Safari on iPhone",
    time: "2 hours ago",
    icon: <IconDeviceLaptop className="size-4" />,
  },
  {
    id: "act-3",
    action: "Changed account billing address",
    device: "Firefox on Windows",
    time: "2 days ago",
    icon: <IconCreditCard className="size-4" />,
  },
]

// To avoid unused import checks, import icons dynamically or locally
import { IconSettings, IconCreditCard } from "@tabler/icons-react"

// ─── Page ─────────────────────────────────────────────────────────────────────

function ProfilePage() {
  const router = useRouter()
  const auth = router.options.context.auth
  const user = auth.user || {
    name: "Administrator",
    email: "admin@acme.com",
    avatar: "",
  }

  const [name, setName] = React.useState(user.name)
  const [email, setEmail] = React.useState(user.email)
  const [bio, setBio] = React.useState(
    "Lead Developer at Acme Inc. Passionate about software architecture, clean code, and developer tools."
  )
  const [timezone, setTimezone] = React.useState("utc-8")
  const [language, setLanguage] = React.useState("en")

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    // Simulated save
    toast.success("Profile updated successfully")
  }

  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Profile"
            description="View and manage your personal account settings."
          />

          {/* Hero section */}
          <div className="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 shadow-xs md:flex-row md:items-start">
            <Avatar className="size-24 shrink-0 border-2 border-primary/20">
              <AvatarImage src={user.avatar} alt={name} />
              <AvatarFallback className="text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-1 flex-col items-center gap-2 text-center md:items-start md:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                <h1 className="text-2xl leading-none font-bold text-foreground">
                  {name}
                </h1>
                <Badge className="bg-primary font-medium text-primary-foreground">
                  <IconShield className="mr-1 size-3.5" aria-hidden="true" />
                  Owner
                </Badge>
              </div>

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center justify-center gap-1.5 md:justify-start">
                  <IconMail className="size-4" />
                  <span>{email}</span>
                </div>
                <div className="flex items-center justify-center gap-1.5 md:justify-start">
                  <IconMapPin className="size-4" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              <p className="mt-2 max-w-xl text-sm text-muted-foreground/80 italic">
                "{bio}"
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="shrink-0"
              onClick={() => {
                const el = document.getElementById("edit-profile-card")
                el?.scrollIntoView({ behavior: "smooth" })
              }}
            >
              <IconEdit className="size-4" />
              Edit Profile
            </Button>
          </div>

          {/* Two-column details grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left column: Edit Profile Card */}
            <form
              id="edit-profile-card"
              onSubmit={handleSave}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Edit Profile</CardTitle>
                  <CardDescription>
                    Update your display name, bio, and workspace localization
                    options.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-name">Display Name</Label>
                    <Input
                      id="profile-name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-email">Email Address</Label>
                    <Input
                      id="profile-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {/* Bio */}
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="profile-bio">Bio</Label>
                    <Textarea
                      id="profile-bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                  </div>

                  {/* Localization row */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-tz">Timezone</Label>
                      <Select
                        value={timezone}
                        onValueChange={(val) => setTimezone(val ?? "utc-8")}
                      >
                        <SelectTrigger id="profile-tz">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc-8">
                            Pacific Time (PT)
                          </SelectItem>
                          <SelectItem value="utc-5">
                            Eastern Time (ET)
                          </SelectItem>
                          <SelectItem value="utc-0">
                            Greenwich Mean Time (GMT)
                          </SelectItem>
                          <SelectItem value="utc+8">
                            Singapore Time (SGT)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="profile-lang">Language</Label>
                      <Select
                        value={language}
                        onValueChange={(val) => setLanguage(val ?? "en")}
                      >
                        <SelectTrigger id="profile-lang">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English (US)</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t border-border">
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </Card>
            </form>

            {/* Right column: Info & Activity feed */}
            <div className="flex flex-col gap-6">
              {/* Account summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <IconUser className="size-4" /> Role
                    </span>
                    <span className="font-medium text-foreground">
                      Workspace Owner
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <IconCalendar className="size-4" /> Joined
                    </span>
                    <span className="font-medium text-foreground">
                      January 10, 2025
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <IconActivity className="size-4" /> Status
                    </span>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/15 text-emerald-700 ring-emerald-500/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30"
                    >
                      Active
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Activity feed */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Security Log</CardTitle>
                  <CardDescription>
                    Latest access history on your account.
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-border border-t border-border">
                    {MOCK_ACTIVITIES.map((act) => (
                      <div
                        key={act.id}
                        className="flex items-start gap-3 p-4 transition-colors hover:bg-muted/30"
                      >
                        <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                          {act.icon}
                        </div>
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <p className="line-clamp-1 text-xs font-medium text-foreground">
                            {act.action}
                          </p>
                          <span className="line-clamp-1 text-[10px] text-muted-foreground/80">
                            {act.device} • {act.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
