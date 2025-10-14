"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Crown, 
  Code, 
  Brain, 
  Database, 
  Github, 
  Linkedin, 
  Mail,
  Sparkles,
  Users,
  Award
} from "lucide-react"

interface TeamMember {
  name: string
  role: string
  specialization: string
  avatar?: string
  initials: string
  description: string
  icon: any
  color: string
  bgColor: string
  textColor: string
}

const teamMembers: TeamMember[] = [
  {
    name: "Muhammad Sajjad Hussain",
    role: "Team Lead",
    specialization: "Project Management & Leadership",
    initials: "MSH",
    description: "Leading the development team with expertise in project coordination and technical oversight.",
    icon: Crown,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20",
    textColor: "text-yellow-600 dark:text-yellow-400"
  },
  {
    name: "Rimsha Saif",
    role: "Frontend Developer",
    specialization: "React, Next.js, UI/UX",
    initials: "RS",
    description: "Creating beautiful and responsive user interfaces with modern web technologies.",
    icon: Code,
    color: "from-blue-500 to-cyan-500",
    bgColor: "from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20",
    textColor: "text-blue-600 dark:text-blue-400"
  },
  {
    name: "Muhammad Areeb",
    role: "AI/ML Engineer",
    specialization: "Machine Learning, Computer Vision",
    initials: "MA",
    description: "Implementing advanced AI algorithms for visual analysis and intelligent insights.",
    icon: Brain,
    color: "from-purple-500 to-pink-500",
    bgColor: "from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20",
    textColor: "text-purple-600 dark:text-purple-400"
  },
  {
    name: "Safiullah Saleem",
    role: "Backend Developer",
    specialization: "Node.js, APIs, Database Design",
    initials: "SS",
    description: "Architecting robust backend systems and scalable API solutions.",
    icon: Database,
    color: "from-indigo-500 to-blue-500",
    bgColor: "from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20",
    textColor: "text-indigo-600 dark:text-indigo-400"
  }
]

export default function TeamSection() {
  return (
    <div className="space-y-8">
      {/* Team Header */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg">
          <div className="w-2 h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development Team</span>
        </div>
        
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 dark:from-purple-100 dark:via-blue-100 dark:to-indigo-100 bg-clip-text text-transparent">
          Meet Our Team
        </h2>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Talented developers working together to create innovative visual analytics solutions
        </p>
      </div>

      {/* Team Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {teamMembers.map((member, index) => {
          const Icon = member.icon
          return (
            <Card 
              key={member.name}
              className={`group relative overflow-hidden border-0 bg-gradient-to-br ${member.bgColor} backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] animate-in fade-in slide-in-from-bottom-4`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Animated background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${member.color}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <CardHeader className="relative pb-2">
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg bg-gradient-to-r ${member.color} text-white shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className={`text-sm font-bold ${member.textColor} leading-tight mb-2`}>
                      {member.name}
                    </CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={`bg-gradient-to-r ${member.color} text-white border-0 shadow-md text-xs`}
                    >
                      {member.role}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="relative space-y-3 pt-0">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Sparkles className="w-3 h-3" />
                    <span>Specialization:</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-5 line-clamp-2">
                    {member.specialization}
                  </p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-700 dark:text-gray-300">
                    <Users className="w-3 h-3" />
                    <span>About:</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 pl-5 line-clamp-2">
                    {member.description}
                  </p>
                </div>
                
                {/* Team member stats */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Award className="w-3 h-3" />
                    <span>Active</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Team Stats */}
      <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-900/90 dark:to-gray-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <CardHeader className="relative">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-gray-500 to-blue-500 text-white shadow-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <CardTitle className="bg-gradient-to-r from-gray-900 to-blue-900 dark:from-white dark:to-blue-100 bg-clip-text text-transparent">
                Team Statistics
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Our development team at a glance
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                4
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Team Members</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Frontend Dev</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">AI/ML Engineer</div>
            </div>
            <div className="text-center space-y-2">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                1
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Backend Dev</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
