"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * Simple loading spinner built on lucide-react's Loader2 icon.
 * Matches shadcn/ui styles via Tailwind classes.
 */
export default function Spinner({ className = "", size = "md", "aria-label": ariaLabel }) {
  const sizeClass =
    size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : size === "xl" ? "h-12 w-12" : "h-5 w-5"

  return (
    <span className={cn("inline-flex items-center justify-center", className)} role="status" aria-live="polite">
      <Loader2 className={cn("animate-spin text-current", sizeClass)} />
      <span className="sr-only">{ariaLabel || "Loading"}</span>
    </span>
  )
}

/**
 * Convenience wrapper for buttons: centers spinner and keeps height.
 * Usage: <Button disabled><Spinner className="mr-2" size="sm" />Saving...</Button>
 */
export function ButtonSpinner({ className = "", size = "sm", "aria-label": ariaLabel }) {
  return <Spinner className={cn("opacity-90", className)} size={size} aria-label={ariaLabel || "Loading"} />
}


