export type AnalyzeRequest = {
  url: string
}

export type JobStatus = "pending" | "running" | "done" | "error"

export type AxeViolation = {
  id: string
  impact?: "minor" | "moderate" | "serious" | "critical"
  description: string
  help: string
  helpUrl?: string
  nodes: Array<{
    target: string[]
    html: string
    failureSummary?: string
  }>
}

export type ContrastIssue = {
  element?: string
  foreground: string
  background: string
  ratio: number
  level?: "AA" | "AAA" | "Fail"
  snippet?: string
}

export type ReimagineReport = {
  summary?: string
  seo?: any
  geo?: any
  color?: any
  layout?: any
  recommendations?: Array<{ title: string; detail?: string }>
  raw?: any
}

export type JobResult = {
  url: string
  createdAt?: string
  durationMs?: number
  readability?: number
  axe_violations?: AxeViolation[]
  contrast_issues?: ContrastIssue[]
  screenshot?: string // e.g., "/assets/<job>.png" (served by backend)
  saliency?: string // e.g., "/assets/<job>-saliency.png"
  reimagine_report?: ReimagineReport
}

export type JobDetailResponse = {
  job_id: string
  status: JobStatus
  error?: string
  result?: JobResult
}

export type ListItem = {
  job_id: string
  url: string
  status: JobStatus
  createdAt: string
  durationMs?: number
}

export type ListResponse = {
  items: ListItem[]
}
