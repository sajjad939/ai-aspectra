"use client"

import type { ContrastIssue } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, AlertTriangle, CheckCircle, Palette } from "lucide-react"

export default function ContrastIssues({ issues }: { issues?: ContrastIssue[] }) {
  if (!issues || issues.length === 0) {
    return (
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-green-50/90 dark:from-gray-900/90 dark:to-green-950/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Color Contrast
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Accessibility compliance check
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 flex items-center justify-center animate-pulse">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              No contrast issues detected. Great accessibility!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-orange-50/90 dark:from-gray-900/90 dark:to-orange-950/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-400 dark:to-red-400 bg-clip-text text-transparent">
              Color Contrast Issues
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Accessibility improvements needed
            </p>
          </div>
        </div>
        <Badge 
          variant="destructive" 
          className="bg-gradient-to-r from-red-500 to-orange-500 text-white border-0 shadow-md animate-in fade-in slide-in-from-right-2 duration-300"
        >
          {issues.length} issues
        </Badge>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        {issues.map((issue, idx) => (
          <div 
            key={idx} 
            className={`group/issue relative overflow-hidden rounded-lg border border-orange-200 dark:border-orange-800 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 animation-delay-${Math.min(idx * 100, 1000)}`}
          >
            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-yellow-500/5 opacity-0 group-hover/issue:opacity-100 transition-opacity duration-300" />
            
            <div className="relative p-4">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge 
                  variant={levelToVariant(issue.level)}
                  className={`${getLevelStyles(issue.level)} animate-in fade-in slide-in-from-left-2 duration-300`}
                >
                  {issue.level || "N/A"}
                </Badge>
                {typeof issue.ratio === "number" && (
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <Palette className="w-4 h-4" />
                    <span>Ratio: {issue.ratio.toFixed(2)}:1</span>
                  </div>
                )}
                {issue.element && (
                  <span className="text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                    {issue.element}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-6 text-xs">
                <Swatch label="Foreground" color={issue.foreground} />
                <Swatch label="Background" color={issue.background} />
              </div>
              
              {issue.snippet && (
                <div className="mt-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <pre className="max-h-32 overflow-auto text-xs text-gray-700 dark:text-gray-300 font-mono">
                    {issue.snippet}
                  </pre>
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function Swatch({ label, color }: { label: string; color: string }) {
  return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <span 
          className="color-swatch group-hover:scale-110"
          style={{ backgroundColor: color }} 
        />
        <div className="absolute inset-0 rounded-lg border-2 border-white dark:border-gray-800" />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}:</span>
        <span className="text-xs font-mono text-gray-800 dark:text-gray-200">{color}</span>
      </div>
    </div>
  )
}

function levelToVariant(level?: string): "default" | "secondary" | "destructive" {
  switch (level) {
    case "AAA":
      return "default"
    case "AA":
      return "secondary"
    case "Fail":
    default:
      return "destructive"
  }
}

function getLevelStyles(level?: string): string {
  switch (level) {
    case "AAA":
      return "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-md"
    case "AA":
      return "bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-md"
    case "Fail":
    default:
      return "bg-gradient-to-r from-red-500 to-pink-500 text-white border-0 shadow-md"
  }
}
