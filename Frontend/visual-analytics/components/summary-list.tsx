"use client"

import { useList } from "@/lib/swr-hooks"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Clock, ExternalLink, CheckCircle, XCircle, Loader2, History } from "lucide-react"

function StatusBadge({ status }: { status: string }) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "done":
        return {
          variant: "default" as const,
          icon: CheckCircle,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          borderColor: "border-green-200 dark:border-green-800"
        }
      case "error":
        return {
          variant: "destructive" as const,
          icon: XCircle,
          color: "text-red-600",
          bgColor: "bg-red-50 dark:bg-red-900/20",
          borderColor: "border-red-200 dark:border-red-800"
        }
      default:
        return {
          variant: "secondary" as const,
          icon: Loader2,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          borderColor: "border-blue-200 dark:border-blue-800"
        }
    }
  }

  const config = getStatusConfig(status)
  const Icon = config.icon

  return (
    <Badge 
      variant={config.variant}
      className={`${config.bgColor} ${config.borderColor} ${config.color} border animate-in fade-in slide-in-from-left-2 duration-300`}
    >
      <Icon className={`w-3 h-3 mr-1 ${status === "processing" ? "animate-spin" : ""}`} />
      {status}
    </Badge>
  )
}

function LoadingSkeleton() {
  return (
    <Card className="border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-gray-400 to-gray-500 text-white">
            <History className="w-5 h-5" />
          </div>
          <CardTitle className="bg-gradient-to-r from-gray-400 to-gray-500 bg-clip-text text-transparent">
            Recent Analyses
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex min-w-0 flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-8 w-16 rounded" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default function SummaryList() {
  const { data, error, isLoading } = useList()

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return (
      <Card className="border-0 bg-gradient-to-br from-white/90 to-red-50/90 dark:from-gray-900/90 dark:to-red-950/90 backdrop-blur-sm shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white">
              <XCircle className="w-5 h-5" />
            </div>
            <CardTitle className="bg-gradient-to-r from-red-600 to-red-700 bg-clip-text text-transparent">
              Recent Analyses
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              Failed to load recent analyses
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = data?.items || []

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-blue-500 text-white shadow-lg">
            <History className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              Recent Analyses
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Your latest website analysis results
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-3">
        {items.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center justify-center">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No analyses yet. Start your first analysis above!
            </p>
          </div>
        )}
        
        {items.map((item, index) => (
          <div 
            key={item.job_id} 
            className={`group/item relative overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4 animation-delay-${Math.min(index * 100, 1000)}`}
          >
            {/* Hover gradient effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300" />
            
            <div className="relative flex items-center justify-between p-4">
              <div className="flex min-w-0 flex-col space-y-2">
                <div className="flex items-center gap-3">
                  <StatusBadge status={item.status} />
                  <span className="truncate font-medium text-gray-900 dark:text-gray-100 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 transition-colors duration-200">
                    {item.url}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                  {typeof item.durationMs === "number" && (
                    <span className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      {Math.round(item.durationMs / 1000)}s
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 shrink-0">
                <Button 
                  asChild 
                  variant="secondary" 
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105"
                >
                  <Link href={`/result/${item.job_id}`} className="flex items-center gap-2">
                    <ExternalLink className="w-3 h-3" />
                    Open
                  </Link>
                </Button>
              </div>
              </div>
            </div>
          ))}
      </CardContent>
    </Card>
  )
}
