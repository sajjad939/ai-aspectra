"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, TrendingUp, AlertCircle, CheckCircle } from "lucide-react"

export default function ReadabilityCard({ score }: { score?: number }) {
  const s = typeof score === "number" ? Math.max(0, Math.min(100, score)) : undefined
  const label =
    typeof s === "number" ? (s >= 60 ? "Easy to read" : s >= 30 ? "Moderately difficult" : "Hard to read") : "Unknown"

  const getScoreConfig = (score: number) => {
    if (score >= 60) {
      return {
        color: "from-green-500 to-emerald-500",
        bgColor: "from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20",
        icon: CheckCircle,
        textColor: "text-green-600 dark:text-green-400"
      }
    } else if (score >= 30) {
      return {
        color: "from-yellow-500 to-orange-500",
        bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
        icon: AlertCircle,
        textColor: "text-yellow-600 dark:text-yellow-400"
      }
    } else {
      return {
        color: "from-red-500 to-pink-500",
        bgColor: "from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20",
        icon: AlertCircle,
        textColor: "text-red-600 dark:text-red-400"
      }
    }
  }

  const config = s ? getScoreConfig(s) : null
  const Icon = config?.icon || BookOpen

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-gray-900/90 dark:to-indigo-950/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${config?.color || 'from-indigo-500 to-blue-500'} text-white shadow-lg`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="bg-gradient-to-r from-indigo-900 to-blue-900 dark:from-indigo-100 dark:to-blue-100 bg-clip-text text-transparent">
              Readability Score
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Flesch-like score: higher is easier to read
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        {typeof s === "number" ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-lg ${config?.textColor}`}>{label}</span>
                <TrendingUp className="w-4 h-4 text-gray-500" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
                  {s.toFixed(0)}
                </div>
                <div className="text-sm text-gray-500">/ 100</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Progress 
                value={s} 
                className="h-3 bg-gray-200 dark:bg-gray-700"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <BookOpen className="w-4 h-4" />
              <span>Reading level assessment based on text complexity</span>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No readability score available
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
