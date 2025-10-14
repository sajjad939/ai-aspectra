"use client"

import { useState } from "react"

type Props = {
  screenshotUrl?: string
  saliencyUrl?: string
  alt?: string
}

export default function HeatmapOverlay({ screenshotUrl, saliencyUrl, alt }: Props) {
  const [opacity, setOpacity] = useState(0.6)

  const hasImages = Boolean(screenshotUrl && saliencyUrl)

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="text-sm font-medium">Saliency overlay opacity</div>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={opacity}
          onChange={(e) => setOpacity(Number.parseFloat(e.target.value))}
          aria-label="Adjust saliency overlay opacity"
          className="w-48"
        />
      </div>
      <div className="relative w-full overflow-hidden rounded-md border">
        {hasImages ? (
          <div className="relative">
            <img
              src={screenshotUrl! || "/placeholder.svg"}
              alt={alt || "Page screenshot"}
              className="block h-auto w-full"
              crossOrigin="anonymous"
            />
            <img
              src={saliencyUrl! || "/placeholder.svg"}
              alt="Saliency heatmap overlay"
              className="pointer-events-none absolute inset-0 h-full w-full object-contain"
              style={{ opacity }}
              crossOrigin="anonymous"
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">No images available</div>
        )}
      </div>
    </div>
  )
}
