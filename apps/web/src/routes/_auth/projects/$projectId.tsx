import * as React from "react"
import {
  createFileRoute,
  Link,
  notFound,
} from "@tanstack/react-router"
import {
  IconChevronRight,
  IconLayoutAlignRight,
  IconLink,
} from "@tabler/icons-react"

import {
  ProjectDetailFiles,
  ProjectDetailHeader,
  ProjectDetailStats,
  ProjectMetaPanel,
} from "@/components/project-detail"
import {
  ProjectActivityTab,
  ProjectIssuesTab,
  ProjectTasksTab,
} from "@/components/project-tabs"
import { ProjectTimelineGantt } from "@/components/project-timeline-gantt"
import { getProjectById } from "@/lib/projects-data"
import { Button } from "@workspace/ui/components/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"

export const Route = createFileRoute("/_auth/projects/$projectId")({
  loader: ({ params }) => {
    const project = getProjectById(params.projectId)
    if (!project) throw notFound()
    return project
  },
  component: ProjectDetailPage,
})

function ProjectDetailPage() {
  const project = Route.useLoaderData()
  const [activeTab, setActiveTab] = React.useState("timeline")
  const [metaOpen, setMetaOpen] = React.useState(false)

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex min-h-0 w-full max-w-full flex-1 flex-col overflow-x-hidden overflow-y-auto xl:flex-row xl:overflow-hidden">
        {/* Main column */}
        <div className="flex max-w-full min-w-0 flex-1 flex-col xl:overflow-hidden">
          {/* Secondary bar */}
          <div className="flex min-h-14 items-center justify-between gap-4 border-b border-border pr-4">
            <div className="min-w-0">
              <nav
                aria-label="Breadcrumb"
                className="text-muted-foreground flex items-center gap-2 text-sm"
              >
                <Link
                  to="/projects"
                  className="hover:text-foreground transition-colors"
                >
                  Projects
                </Link>
                <IconChevronRight
                  className="text-muted-foreground size-4"
                  aria-hidden="true"
                />
                <span className="text-foreground truncate">{project.name}</span>
              </nav>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                aria-label="Copy link"
                type="button"
              >
                <IconLink className="size-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="xl:hidden"
                aria-label="Open project details panel"
                type="button"
                onClick={() => setMetaOpen(true)}
              >
                <IconLayoutAlignRight className="size-4" aria-hidden="true" />
              </Button>
            </div>
          </div>

          {/* Scrollable main */}
          <div className="min-h-0 flex-1 xl:overflow-y-auto">
            <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pr-4">
              <ProjectDetailHeader project={project} />
              <ProjectDetailStats project={project} />

              <section className="space-y-3">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Project brief
                </p>
                <p className="max-w-4xl text-sm leading-6 text-muted-foreground">
                  {project.brief}
                </p>
              </section>

              <ProjectDetailFiles project={project} />

              <Tabs value={activeTab} onValueChange={setActiveTab} className="gap-6">
                <div className="overflow-x-auto border-b">
                  <TabsList variant="line" className="h-auto min-w-max justify-start gap-7 rounded-none p-0 sm:gap-8">
                    <TabsTrigger value="timeline">Timeline</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="activity">Activity</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="timeline">
                  <ProjectTimelineGantt project={project} />
                </TabsContent>
                <TabsContent value="tasks">
                  <ProjectTasksTab project={project} />
                </TabsContent>
                <TabsContent value="issues">
                  <ProjectIssuesTab project={project} />
                </TabsContent>
                <TabsContent value="activity">
                  <ProjectActivityTab project={project} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* Meta sidebar (desktop) */}
        <aside className="hidden xl:flex">
          <ProjectMetaPanel project={project} />
        </aside>
      </div>

      {/* Meta sidebar (mobile sheet) */}
      <Sheet open={metaOpen} onOpenChange={setMetaOpen}>
        <SheetContent side="right" className="sm:max-w-md w-full p-0">
          <SheetHeader className="px-5 pt-6 pb-4">
            <SheetTitle>Project details</SheetTitle>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto">
            <ProjectMetaPanel project={project} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
