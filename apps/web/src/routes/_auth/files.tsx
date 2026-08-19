import * as React from "react"
import { createFileRoute } from "@tanstack/react-router"
import {
  IconDotsVertical,
  IconFile,
  IconFolder,
  IconLayoutGrid,
  IconList,
  IconPencil,
  IconPlus,
  IconTrash,
  IconUpload,
} from "@tabler/icons-react"

import { PageHeader } from "@/components/page-header"
import {
  type FileItem,
  type FileType,
  formatBytes,
  initialFiles,
} from "@/lib/files-data"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@workspace/ui/components/breadcrumb"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"

export const Route = createFileRoute("/_auth/files")({
  component: FilesPage,
})

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFileIcon(type: FileType) {
  switch (type) {
    case "folder":
      return <IconFolder className="size-8 text-blue-500" />
    case "pdf":
      return <IconFile className="size-8 text-rose-500" />
    case "image":
      return <IconFile className="size-8 text-amber-500" />
    case "doc":
      return <IconFile className="size-8 text-indigo-500" />
    case "spreadsheet":
      return <IconFile className="size-8 text-emerald-500" />
    default:
      return <IconFile className="size-8 text-muted-foreground" />
  }
}

// ─── Rename Dialog ────────────────────────────────────────────────────────────

interface RenameDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: FileItem | null
  onRename: (id: string, newName: string) => void
}

function RenameDialog({
  open,
  onOpenChange,
  item,
  onRename,
}: RenameDialogProps) {
  const [name, setName] = React.useState(item?.name ?? "")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (item && name.trim()) {
      onRename(item.id, name.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
            <DialogDescription>
              Enter a new name for the file or folder.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rename-input">Name</Label>
            <Input
              id="rename-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Rename</Button>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Create Folder Dialog ─────────────────────────────────────────────────────

interface CreateFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (name: string) => void
}

function CreateFolderDialog({
  open,
  onOpenChange,
  onCreate,
}: CreateFolderDialogProps) {
  const [name, setName] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) {
      onCreate(name.trim())
      setName("")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>New Folder</DialogTitle>
            <DialogDescription>
              Create a new folder in the current directory.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="folder-name-input">Folder Name</Label>
            <Input
              id="folder-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Invoices"
              required
            />
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Create Folder</Button>
            <DialogClose render={<Button variant="outline" type="button" />}>
              Cancel
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

// ─── Upload Dialog ────────────────────────────────────────────────────────────

interface UploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (name: string, type: FileType, size: number) => void
}

function UploadDialog({ open, onOpenChange, onUpload }: UploadDialogProps) {
  const [name, setName] = React.useState("")
  const [type, setType] = React.useState<FileType>("pdf")
  const [sizeInput, setSizeInput] = React.useState("1.5") // MB

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (name.trim()) {
      const sizeBytes = (parseFloat(sizeInput) || 1) * 1024 * 1024
      onUpload(name.trim(), type, sizeBytes)
      setName("")
      setType("pdf")
      setSizeInput("1.5")
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Simulate Upload</DialogTitle>
            <DialogDescription>
              Simulate uploading a new file to the current directory.
            </DialogDescription>
          </DialogHeader>

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="file-name-input">File Name</Label>
            <Input
              id="file-name-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. annual-report.pdf"
              required
            />
          </div>

          {/* Type + Size */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="file-type-select">File Type</Label>
              <Select
                value={type}
                onValueChange={(val) => setType(val as FileType)}
              >
                <SelectTrigger id="file-type-select">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF Document</SelectItem>
                  <SelectItem value="image">Image File</SelectItem>
                  <SelectItem value="doc">Word Document</SelectItem>
                  <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                  <SelectItem value="other">Other file</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="file-size-input">File Size (MB)</Label>
              <Input
                id="file-size-input"
                type="number"
                step="0.1"
                min="0.1"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-2">
            <Button type="submit">Upload File</Button>
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

function FilesPage() {
  const [files, setFiles] = React.useState<FileItem[]>(initialFiles)
  const [currentFolderId, setCurrentFolderId] = React.useState<string | null>(
    null
  )
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [renameItem, setRenameItem] = React.useState<FileItem | null>(null)
  const [renameOpen, setRenameOpen] = React.useState(false)
  const [folderOpen, setFolderOpen] = React.useState(false)
  const [uploadOpen, setUploadOpen] = React.useState(false)

  // Trace ancestors to build breadcrumbs
  const breadcrumbs = React.useMemo(() => {
    const list: { id: string | null; name: string }[] = [
      { id: null, name: "Root" },
    ]
    if (!currentFolderId) return list

    const path: { id: string; name: string }[] = []
    let curr = files.find((f) => f.id === currentFolderId)
    while (curr) {
      path.unshift({ id: curr.id, name: curr.name })
      curr = curr.parentId
        ? files.find((f) => f.id === curr?.parentId)
        : undefined
    }

    return [...list, ...path]
  }, [files, currentFolderId])

  // Filter items in the current folder
  const currentItems = React.useMemo(() => {
    return files.filter((f) => f.parentId === currentFolderId)
  }, [files, currentFolderId])

  function handleRename(id: string, newName: string) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, name: newName } : f))
    )
  }

  function handleDelete(id: string) {
    // Delete files recursively if it's a folder
    setFiles((prev) => {
      const idsToDelete = new Set<string>([id])
      let sizeBefore = 0

      // BFS/DFS to find all child items
      while (idsToDelete.size !== sizeBefore) {
        sizeBefore = idsToDelete.size
        prev.forEach((f) => {
          if (f.parentId && idsToDelete.has(f.parentId)) {
            idsToDelete.add(f.id)
          }
        })
      }

      return prev.filter((f) => !idsToDelete.has(f.id))
    })
  }

  function handleCreateFolder(name: string) {
    const newFolder: FileItem = {
      id: `dir-${Date.now()}`,
      name,
      type: "folder",
      modifiedAt: new Date().toISOString().slice(0, 10),
      parentId: currentFolderId,
    }

    setFiles((prev) => [...prev, newFolder])
  }

  function handleUpload(name: string, type: FileType, size: number) {
    const newFile: FileItem = {
      id: `file-${Date.now()}`,
      name,
      type,
      size,
      modifiedAt: new Date().toISOString().slice(0, 10),
      parentId: currentFolderId,
    }
    setFiles((prev) => [...prev, newFile])
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <PageHeader
            title="File Manager"
            description="Upload, organize, and manage your assets."
          >
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center rounded-md border border-border bg-muted/40 p-0.5">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                >
                  <IconLayoutGrid className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="size-7"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <IconList className="size-4" />
                </Button>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setFolderOpen(true)}
              >
                <IconPlus className="size-4" />
                New Folder
              </Button>

              <Button size="sm" onClick={() => setUploadOpen(true)}>
                <IconUpload className="size-4" />
                Upload
              </Button>
            </div>
          </PageHeader>

          {/* Breadcrumbs Navigation */}
          <div className="px-1 py-1">
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((bc, idx) => {
                  const isLast = idx === breadcrumbs.length - 1
                  return (
                    <React.Fragment key={bc.id || "root"}>
                      <BreadcrumbItem>
                        {isLast ? (
                          <BreadcrumbPage>{bc.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink
                            className="cursor-pointer"
                            onClick={() => setCurrentFolderId(bc.id)}
                          >
                            {bc.name}
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {!isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  )
                })}
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* File grid / list */}
          {currentItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border bg-card py-20 text-center">
              <IconFolder className="size-16 text-muted-foreground/30" />
              <div>
                <p className="text-sm font-medium">Folder is empty</p>
                <p className="text-sm text-muted-foreground">
                  Upload a file or create a folder to get started.
                </p>
              </div>
            </div>
          ) : viewMode === "grid" ? (
            /* Grid View */
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex flex-col items-center justify-between rounded-lg border border-border bg-card p-4 text-center transition-shadow hover:shadow-xs"
                >
                  {/* Actions Dropdown */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            variant="ghost"
                            className="size-7 text-muted-foreground"
                            size="icon"
                          />
                        }
                      >
                        <IconDotsVertical className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem
                          onClick={() => {
                            setRenameItem(item)
                            setRenameOpen(true)
                          }}
                        >
                          <IconPencil className="mr-2 size-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          variant="destructive"
                          onClick={() => handleDelete(item.id)}
                        >
                          <IconTrash className="mr-2 size-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Icon + Doubleclick navigation for folders */}
                  <div
                    className="flex flex-1 cursor-pointer flex-col items-center justify-center pt-4 pb-2"
                    onClick={() => {
                      if (item.type === "folder") {
                        setCurrentFolderId(item.id)
                      }
                    }}
                  >
                    {getFileIcon(item.type)}
                    <span className="mt-3 line-clamp-1 w-full px-2 text-sm font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>

                  {/* Info details */}
                  <div className="text-[11px] text-muted-foreground tabular-nums">
                    {item.type === "folder" ? "Folder" : formatBytes(item.size)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <table className="w-full text-sm">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Type
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Size
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Modified
                    </th>
                    <th className="w-[80px]"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {currentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <td className="px-4 py-3 font-medium">
                        <button
                          type="button"
                          className="flex items-center gap-3 text-left hover:underline"
                          onClick={() => {
                            if (item.type === "folder") {
                              setCurrentFolderId(item.id)
                            }
                          }}
                        >
                          {getFileIcon(item.type)}
                          <span>{item.name}</span>
                        </button>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {item.type.toUpperCase()}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground tabular-nums">
                        {item.type === "folder" ? "—" : formatBytes(item.size)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground tabular-nums">
                        {item.modifiedAt}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <Button
                                variant="ghost"
                                className="size-8 text-muted-foreground"
                                size="icon"
                              />
                            }
                          >
                            <IconDotsVertical className="size-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-40">
                            <DropdownMenuItem
                              onClick={() => {
                                setRenameItem(item)
                                setRenameOpen(true)
                              }}
                            >
                              <IconPencil className="mr-2 size-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => handleDelete(item.id)}
                            >
                              <IconTrash className="mr-2 size-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <RenameDialog
        key={renameItem?.id ?? "none"}
        open={renameOpen}
        onOpenChange={setRenameOpen}
        item={renameItem}
        onRename={handleRename}
      />

      <CreateFolderDialog
        open={folderOpen}
        onOpenChange={setFolderOpen}
        onCreate={handleCreateFolder}
      />

      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUpload={handleUpload}
      />
    </div>
  )
}
