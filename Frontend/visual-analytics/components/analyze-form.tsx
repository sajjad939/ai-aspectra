"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"
import type { AnalyzeRequest } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, Sparkles, Loader2 } from "lucide-react"

export default function AnalyzeForm() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    const trimmed = url.trim()
    if (!trimmed) {
      setError("Please enter a URL.")
      return
    }
    try {
      setLoading(true)
      const payload: AnalyzeRequest = { url: trimmed }
      try {
        const res = await api.post<{ job_id: string }>("/api/analyze", payload)
        router.push(`/result/${res.job_id}`)
      } catch (apiError) {
        console.error("API Error:", apiError)
        setError("Connection to analysis server failed. Please try again.")
        throw apiError
      }
    } catch (err: any) {
      setError(err?.message || "Failed to start analysis.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-gray-900/90 dark:to-blue-950/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-balance bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
              AI-Powered Analysis
            </CardTitle>
            <CardDescription className="text-pretty text-gray-600 dark:text-gray-300">
              Enter a URL to analyze accessibility, readability, and visual attention with advanced AI insights
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="relative">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200">
                <Search className="w-4 h-4" />
              </div>
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                aria-label="Website URL"
                className="pl-10 h-12 text-lg border-2 border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-600 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                disabled={loading}
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Start Analysis</span>
              </>
            )}
          </Button>
        </form>
        
        {error && (
          <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in slide-in-from-top-2 duration-300">
            <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
              {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
