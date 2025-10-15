export type AnalyzeRequest = {
  url: string
  prompts?: string[]
}

export type JobStatus = "pending" | "running" | "completed" | "error"

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
  foreground?: string
  background?: string
  ratio: number
  level?: "AA" | "AAA" | "Fail"
  snippet?: string
  wcag_level?: string
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

export type ReadabilityMetrics = {
  score: number
  grade_level: string
  reading_time: string
}

export type JobResult = {
  url: string
  createdAt?: string
  durationMs?: number
  readability?: ReadabilityMetrics
  axe_violations?: AxeViolation[]
  contrast_issues?: ContrastIssue[]
  screenshot_path?: string
  saliency_path?: string
  suggestions?: string[]
  prompt_results?: any[]
}

export type JobResponse = {
  job_id: string
  status: JobStatus
  result?: JobResult
}

export type JobDetailResponse = JobResponse

export type ListResponse = {
  jobs: JobResponse[]
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
