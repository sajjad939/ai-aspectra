"use client"

import { Loader2, Sparkles, Zap } from "lucide-react"

interface AnimatedLoaderProps {
  message?: string
  size?: "sm" | "md" | "lg"
  variant?: "default" | "sparkles" | "zap"
}

export default function AnimatedLoader({ 
  message = "Loading...", 
  size = "md",
  variant = "default"
}: AnimatedLoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  const getIcon = () => {
    switch (variant) {
      case "sparkles":
        return <Sparkles className={`${sizeClasses[size]} animate-spin`} />
      case "zap":
        return <Zap className={`${sizeClasses[size]} animate-pulse`} />
      default:
        return <Loader2 className={`${sizeClasses[size]} animate-spin`} />
    }
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-indigo-500/20 animate-pulse-glow" />
        
        {/* Main icon container */}
        <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
          {getIcon()}
        </div>
        
        {/* Floating particles */}
        <div className="absolute -top-2 -right-2 w-3 h-3 bg-yellow-400 rounded-full animate-float" />
        <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full animate-float delay-1000" />
        <div className="absolute top-1/2 -left-3 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float delay-2000" />
      </div>
      
      <div className="text-center space-y-2">
        <p className={`font-medium text-gray-700 dark:text-gray-300 ${textSizeClasses[size]}`}>
          {message}
        </p>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
          <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse delay-200" />
          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse delay-400" />
        </div>
      </div>
    </div>
  )
}

export function LoadingDots() {
  return (
    <div className="flex items-center space-x-1">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" />
      <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100" />
      <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce delay-200" />
    </div>
  )
}

export function LoadingSpinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  }

  return (
    <div className="relative">
      <Loader2 className={`${sizeClasses[size]} animate-spin text-blue-500`} />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-500 animate-spin" />
    </div>
  )
}
