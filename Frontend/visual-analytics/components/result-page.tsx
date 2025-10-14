"use client"

import { useJob } from "@/lib/swr-hooks"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import HeatmapOverlay from "./heatmap-overlay"
import AxeViolations from "./axe-violations"
import ContrastIssues from "./contrast-issues"
import ReadabilityCard from "./readability-card"
import ReimaginePanel from "./reimagine-panel"
import ResultHeader from "./result-header"
import { Skeleton } from "@/components/ui/skeleton"

export default function ResultPage({ jobId }: { jobId: string }) {
  const router = useRouter()
  const { data, error, isLoading } = useJob(jobId)
  const status = data?.status

  useEffect(() => {
    if (data?.status === "error" && data?.error) {
      console.error("[v0] Job error:", data.error)
    }
    
    // Handle any unexpected errors gracefully
    if (error) {
      console.error("[v0] SWR error:", error)
      // Force revalidation on error
      setTimeout(() => {
        router.refresh()
      }, 2000)
    }
  }, [data, error, router])

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Failed to load job.</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "error") {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-destructive">Analysis failed: {data.error || "Unknown error"}</p>
        </CardContent>
      </Card>
    )
  }

  if (status === "pending" || status === "running") {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm">Your analysis is {status}. This page will update automatically.</p>
          </CardContent>
        </Card>
        <Skeleton className="h-64 w-full" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    )
  }

  const r = data.result!
  return (
    <div className="space-y-4">
      <ResultHeader url={r.url} createdAt={r.createdAt} durationMs={r.durationMs} />

      <HeatmapOverlay screenshotUrl={r.screenshot} saliencyUrl={r.saliency} alt={`Screenshot for ${r.url}`} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ReadabilityCard score={r.readability} />
        <ContrastIssues issues={r.contrast_issues} />
        <ReimaginePanel report={r.reimagine_report} />
      </div>

      <AxeViolations violations={r.axe_violations} />
    </div>
  )
}
