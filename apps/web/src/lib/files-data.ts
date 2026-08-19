// ─── Types ────────────────────────────────────────────────────────────────────

export type FileType =
  "folder" | "pdf" | "image" | "doc" | "spreadsheet" | "other"

export type FileItem = {
  id: string
  name: string
  type: FileType
  size?: number // in bytes, undefined for folders
  modifiedAt: string // ISO date string
  parentId: string | null // null means root directory
}

// ─── Static mock data ─────────────────────────────────────────────────────────

export const initialFiles: FileItem[] = [
  // Root level folders
  {
    id: "dir-1",
    name: "Documents",
    type: "folder",
    modifiedAt: "2026-08-18",
    parentId: null,
  },
  {
    id: "dir-2",
    name: "Images",
    type: "folder",
    modifiedAt: "2026-08-17",
    parentId: null,
  },
  {
    id: "dir-3",
    name: "Marketing Plan",
    type: "folder",
    modifiedAt: "2026-08-10",
    parentId: null,
  },

  // Root level files
  {
    id: "file-1",
    name: "annual-report-2025.pdf",
    type: "pdf",
    size: 2450000,
    modifiedAt: "2026-08-12",
    parentId: null,
  },
  {
    id: "file-2",
    name: "invoices-summary.xlsx",
    type: "spreadsheet",
    size: 1200000,
    modifiedAt: "2026-08-15",
    parentId: null,
  },

  // Documents folder contents
  {
    id: "file-3",
    name: "Contract-Acme-Signed.pdf",
    type: "pdf",
    size: 4500000,
    modifiedAt: "2026-08-14",
    parentId: "dir-1",
  },
  {
    id: "file-4",
    name: "ProductSpecs.docx",
    type: "doc",
    size: 850000,
    modifiedAt: "2026-08-18",
    parentId: "dir-1",
  },
  {
    id: "file-5",
    name: "meeting-notes.docx",
    type: "doc",
    size: 120000,
    modifiedAt: "2026-08-18",
    parentId: "dir-1",
  },

  // Images folder contents
  {
    id: "file-6",
    name: "hero-banner-v2.jpg",
    type: "image",
    size: 1048576,
    modifiedAt: "2026-08-17",
    parentId: "dir-2",
  },
  {
    id: "file-7",
    name: "logo-white.png",
    type: "image",
    size: 256000,
    modifiedAt: "2026-08-16",
    parentId: "dir-2",
  },
  {
    id: "file-8",
    name: "avatar-placeholder.png",
    type: "image",
    size: 64000,
    modifiedAt: "2026-08-01",
    parentId: "dir-2",
  },

  // Marketing Plan folder contents
  {
    id: "dir-4",
    name: "Q3 Campaign",
    type: "folder",
    modifiedAt: "2026-08-10",
    parentId: "dir-3",
  },
  {
    id: "file-9",
    name: "budget-allocation.xlsx",
    type: "spreadsheet",
    size: 550000,
    modifiedAt: "2026-08-09",
    parentId: "dir-3",
  },

  // Q3 Campaign folder contents
  {
    id: "file-10",
    name: "copywriting-social.docx",
    type: "doc",
    size: 95000,
    modifiedAt: "2026-08-10",
    parentId: "dir-4",
  },
  {
    id: "file-11",
    name: "ad-creative-1.jpg",
    type: "image",
    size: 2048000,
    modifiedAt: "2026-08-10",
    parentId: "dir-4",
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function formatBytes(bytes?: number): string {
  if (bytes === undefined) return "—"
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}
