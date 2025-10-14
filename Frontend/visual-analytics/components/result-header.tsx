"use client"

import PdfExportButton from "./pdf-export-button"
import ShareLink from "./share-link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ResultHeader({
  url,
  createdAt,
  durationMs,
}: {
  url?: string
  createdAt?: string
  durationMs?: number
}) {
  return (
    <Card>
      <CardHeader className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
        <div>
          <CardTitle className="text-balance">Analysis Result</CardTitle>
          <CardDescription className="text-pretty">{url || "Unknown URL"}</CardDescription>
          <div className="mt-1 text-xs text-muted-foreground">
            {createdAt ? `Analyzed: ${new Date(createdAt).toLocaleString()}` : null}
            {typeof durationMs === "number" ? ` • ${Math.round(durationMs / 1000)}s` : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PdfExportButton />
          <ShareLink />
        </div>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Adjust overlay opacity to inspect high-attention regions. Use the sections below for accessibility and
        readability insights, plus ReimagineWeb recommendations.
      </CardContent>
    </Card>
  )
}
