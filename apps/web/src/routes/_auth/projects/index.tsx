import { createFileRoute, useNavigate } from "@tanstack/react-router"
import {
  IconAlertTriangle,
  IconBriefcase,
  IconCircleCheck,
  IconClock,
  IconPlus,
} from "@tabler/icons-react"
import * as React from "react"

import { PageHeader } from "@/components/page-header"
import { ProjectDataTable } from "@/components/project-data-table"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  computeStats,
  initialProjects,
  type Project,
} from "@/lib/projects-data"

export const Route = createFileRoute("/_auth/projects/")({
  component: ProjectsPage,
})

const STAT_CARDS: {
  label: string
  key: keyof ReturnType<typeof computeStats>
  icon: React.ReactNode
  hint: string
}[] = [
  {
    label: "Total Projects",
    key: "total",
    icon: <IconBriefcase className="size-4" aria-hidden="true" />,
    hint: "All projects across the org",
  },
  {
    label: "Active",
    key: "active",
    icon: <IconCircleCheck className="size-4" aria-hidden="true" />,
    hint: "In-flight initiatives",
  },
  {
    label: "On Track",
    key: "onTrack",
    icon: <IconClock className="size-4" aria-hidden="true" />,
    hint: "Active with health ≥ 60%",
  },
  {
    label: "Due Soon",
    key: "dueSoon",
    icon: <IconAlertTriangle className="size-4" aria-hidden="true" />,
    hint: "Active, ≤ 14 days left",
  },
]

function ProjectsPage() {
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const navigate = useNavigate()

  const stats = React.useMemo(() => computeStats(projects), [projects])

  function handleViewDetail(project: Project) {
    navigate({ to: "/projects/$projectId", params: { projectId: project.id } })
  }

  function handleEdit(project: Project) {
    navigate({ to: "/projects/$projectId", params: { projectId: project.id } })
  }

  function handleDelete(project: Project) {
    setProjects((prev) =>
      prev.map((p) => (p.id === project.id ? { ...p, status: "cancelled" } : p))
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="Projects"
            description="Manage and track all projects across the organization."
          >
            <Button size="sm">
              <IconPlus className="size-4" aria-hidden="true" />
              Add Project
            </Button>
          </PageHeader>

          <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
            {STAT_CARDS.map((card) => (
              <Card key={card.label} className="@container/card">
                <CardHeader>
                  <CardDescription>{card.label}</CardDescription>
                  <CardTitle className="flex items-center justify-between text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                    {stats[card.key]}
                    <CardAction>
                      <Badge variant="outline">{card.icon}</Badge>
                    </CardAction>
                  </CardTitle>
                </CardHeader>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    {card.hint}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>

          <ProjectDataTable
            data={projects}
            onViewDetail={handleViewDetail}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  )
}
