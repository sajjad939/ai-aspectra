"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Check, LinkIcon } from "lucide-react"

export default function ShareLink() {
  const [copied, setCopied] = useState(false)

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // ignore
    }
  }

  return (
    <Button variant="outline" onClick={onCopy}>
      {copied ? <Check className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
      {copied ? "Copied" : "Share link"}
    </Button>
  )
}
