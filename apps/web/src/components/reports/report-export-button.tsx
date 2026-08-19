import { IconDownload, IconFileSpreadsheet, IconFileTypePdf } from "@tabler/icons-react"
import { Button } from "@workspace/ui/components/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"

export function ReportExportButton() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={
        <Button variant="outline" size="sm">
          <IconDownload className="mr-2 size-4" />
          Export
        </Button>
      } />
      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <IconFileSpreadsheet className="mr-2 size-4 text-emerald-600" />
          <span>Export CSV (Excel)</span>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconFileTypePdf className="mr-2 size-4 text-rose-600" />
          <span>Export PDF</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
