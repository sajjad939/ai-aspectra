"use client"

import { useCallback, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import HeatmapOverlay from "@/components/heatmap-overlay"
import AxeViolations from "@/components/axe-violations"
import ContrastIssues from "@/components/contrast-issues"
import ReadabilityCard from "@/components/readability-card"
import ReimaginePanel from "@/components/reimagine-panel"
import type { AxeViolation, ContrastIssue, ReimagineReport } from "@/lib/types"
import { Share2, Download, Eye, BarChart3, AlertTriangle, CheckCircle, Clock } from "lucide-react"

export default function DummyDetailView() {
  // Dummy data for https://example.com
  const url = "https://example.com"
  const screenshotSrc = "/website-screenshot-for-example-com.jpg"
  const saliencySrc = "/saliency-heatmap-overlay-example.jpg"
  const readability = { score: 62.5, level: "8th grade" }
  const violations: AxeViolation[] = [
    {
      id: "color-contrast",
      impact: "serious",
      description: "Elements must have sufficient color contrast.",
      help: "Elements must have sufficient color contrast.",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.8/color-contrast",
      nodes: [
        {
          target: ["h1.site-title"],
          html: '<h1 class="site-title">Welcome</h1>',
          failureSummary: "Fix contrast for the heading.",
        },
      ],
    },
    {
      id: "image-alt",
      impact: "moderate",
      description: "Images must have alternate text.",
      help: "Images must have alternate text.",
      helpUrl: "https://dequeuniversity.com/rules/axe/4.8/image-alt",
      nodes: [
        {
          target: ["img.hero"],
          html: '<img class="hero" src="/hero.jpg" />',
          failureSummary: "Provide descriptive alt text.",
        },
      ],
    },
  ]
  const contrastIssues: ContrastIssue[] = [
    {
      element: "h1.site-title",
      foreground: "#8A8A8A",
      background: "#FFFFFF",
      ratio: 2.8,
      level: "Fail",
      snippet: '<h1 class="site-title">Welcome</h1>',
    },
    {
      element: ".subtle-text",
      foreground: "#99AABB",
      background: "#FFFFFF",
      ratio: 3.2,
      level: "Fail",
      snippet: '<p class="subtle-text">Lorem ipsum</p>',
    },
    {
      element: ".button-primary",
      foreground: "#FFFFFF",
      background: "#0747A6",
      ratio: 4.6,
      level: "AA",
      snippet: '<button class="button-primary">Buy now</button>',
    },
  ]
  const reimagineReport: ReimagineReport = {
    summary:
      "Overall design is clean with opportunities to improve contrast and clarify hero messaging for faster comprehension.",
    recommendations: [
      {
        title: "Increase text contrast in hero",
        detail: "Use darker foreground or lighter background to meet WCAG AA (4.5:1 for body text).",
      },
      {
        title: "Add descriptive alt text to key imagery",
        detail: "Provide concise alt text for the hero image and product thumbnails to improve accessibility and SEO.",
      },
    ],
  }

  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">("idle")

  const shareUrl = useMemo(() => {
    // In a real app this would be a shareable result link. For demo, current URL.
    if (typeof window !== "undefined") return window.location.href
    return url
  }, [url])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopyState("copied")
      setTimeout(() => setCopyState("idle"), 1500)
    } catch {
      setCopyState("error")
      setTimeout(() => setCopyState("idle"), 1500)
    }
  }, [shareUrl])

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print()
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Top: URL + actions */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-gray-900/90 dark:to-purple-950/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg">
                <BarChart3 className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-pretty bg-gradient-to-r from-purple-900 to-blue-900 dark:from-purple-100 dark:to-blue-100 bg-clip-text text-transparent">
                  Analysis Results
                </CardTitle>
                <CardDescription className="text-pretty text-gray-600 dark:text-gray-300">
                  Comprehensive visual and accessibility analysis for {url}
                </CardDescription>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="secondary" 
              onClick={handleCopy}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Share2 className="w-4 h-4 mr-2" />
              {copyState === "copied" ? "Link copied" : "Share link"}
            </Button>
            <Button 
              onClick={handlePrint}
              className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Main grid */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="bg-gradient-to-r from-blue-900 to-purple-900 dark:from-blue-100 dark:to-purple-100 bg-clip-text text-transparent">
                  Visual Analysis
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300">
                  Interactive screenshot with saliency heatmap overlay
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <HeatmapOverlay
              screenshotUrl={screenshotSrc}
              saliencyUrl={saliencySrc}
              alt="Screenshot of example.com with saliency overlay"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <ReadabilityCard score={readability.score} />
          <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <CardHeader className="relative">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <CardTitle className="bg-gradient-to-r from-green-900 to-emerald-900 dark:from-green-100 dark:to-emerald-100 bg-clip-text text-transparent">
                    Quick Stats
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-300">
                    At-a-glance accessibility metrics
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="relative flex flex-wrap gap-3">
              <Badge 
                variant="destructive" 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md animate-in fade-in slide-in-from-left-2 duration-300"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Violations: {violations.length}
              </Badge>
              <Badge 
                variant="destructive"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-md animate-in fade-in slide-in-from-left-2 duration-300 delay-100"
              >
                <AlertTriangle className="w-3 h-3 mr-1" />
                Failing contrast: {contrastIssues.filter((i) => i.level === "Fail").length}
              </Badge>
              <Badge 
                variant="default"
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md animate-in fade-in slide-in-from-left-2 duration-300 delay-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Readability: {readability.level}
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />

      {/* Details sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <AxeViolations violations={violations} />
        </div>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-400">
          <ContrastIssues issues={contrastIssues} />
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-600">
        <ReimaginePanel report={reimagineReport} />
      </div>
    </div>
  )
}
