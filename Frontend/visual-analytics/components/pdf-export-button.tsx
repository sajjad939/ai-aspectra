"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default function PdfExportButton() {
  return (
    <Button
      variant="secondary"
      onClick={() => {
        if (typeof window !== "undefined") window.print()
      }}
    >
      <Printer className="mr-2 h-4 w-4" />
      Export PDF
    </Button>
  )
}
