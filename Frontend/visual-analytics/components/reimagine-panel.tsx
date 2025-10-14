"use client"

import type { ReimagineReport } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReimaginePanel({ report }: { report?: ReimagineReport }) {
  if (!report) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ReimagineWeb Report</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No report attached.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>ReimagineWeb Report</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {report.summary && <p className="text-sm">{report.summary}</p>}
        {report.recommendations && report.recommendations.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm font-medium">Recommendations</div>
            <ul className="list-disc space-y-1 pl-5 text-sm">
              {report.recommendations.map((r, i) => (
                <li key={i}>
                  <span className="font-medium">{r.title}</span>
                  {r.detail ? <span className="text-muted-foreground"> — {r.detail}</span> : null}
                </li>
              ))}
            </ul>
          </div>
        )}
        {!report.summary && (!report.recommendations || report.recommendations.length === 0) && (
          <p className="text-sm text-muted-foreground">Report attached (no summary to display).</p>
        )}
      </CardContent>
    </Card>
  )
}
