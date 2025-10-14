import DummyDetailView from "@/components/detail-view"
import ParticleBackground, { FloatingShapes } from "@/components/particle-background"
import TeamSection from "@/components/team-section"
import { Sparkles, Eye, BarChart3 } from "lucide-react"

export default function DemoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>
      
      {/* Particle Background */}
      <ParticleBackground />
      <FloatingShapes />

      <main className="relative container mx-auto max-w-6xl space-y-8 px-4 py-12">
        {/* Animated Hero Section */}
        <header className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg animate-in fade-in slide-in-from-top-2 duration-700 delay-300">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Live Demo</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            Demo Analytics
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            Experience our Visual Experience Analytics with interactive demo data
          </p>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500 dark:text-gray-400 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-900">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
              <span>Interactive Demo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
              <span>Real-time Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span>Visual Insights</span>
            </div>
          </div>
        </header>

        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
          <DummyDetailView />
        </div>
        
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1200">
          <TeamSection />
        </div>
      </main>
    </div>
  )
}
