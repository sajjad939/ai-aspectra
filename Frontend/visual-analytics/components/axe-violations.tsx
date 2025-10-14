"use client"

import type { AxeViolation } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

export default function AxeViolations({ violations }: { violations?: AxeViolation[] }) {
  if (!violations || violations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Accessibility (axe-core)</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No violations detected.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Accessibility (axe-core)</CardTitle>
        <Badge variant="secondary">{violations.length} issues</Badge>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {violations.map((v) => (
            <AccordionItem key={v.id} value={v.id}>
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Badge variant={impactToVariant(v.impact)}>{v.impact || "info"}</Badge>
                  <span className="text-left">{v.help}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{v.description}</p>
                  {v.helpUrl && (
                    <a className="text-sm underline" href={v.helpUrl} target="_blank" rel="noreferrer">
                      Learn more
                    </a>
                  )}
                  <div className="mt-3 space-y-3">
                    {v.nodes?.slice(0, 5).map((n, idx) => (
                      <div key={idx} className="rounded-md border p-2">
                        <div className="text-xs text-muted-foreground">Targets: {n.target.join(", ")}</div>
                        <pre className="mt-1 max-h-40 overflow-auto rounded bg-muted p-2 text-xs">{n.html}</pre>
                        {n.failureSummary && <p className="mt-1 text-xs">{n.failureSummary}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}

function impactToVariant(
  impact?: "minor" | "moderate" | "serious" | "critical",
): "default" | "secondary" | "destructive" {
  switch (impact) {
    case "critical":
    case "serious":
      return "destructive"
    case "moderate":
      return "default"
    case "minor":
    default:
      return "secondary"
  }
}
