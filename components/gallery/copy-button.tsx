"use client"

import * as React from "react"
import { CheckCircleIcon, CopyIcon } from "@solar-icons/react/linear"

import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"

export function CopyButton({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      className={className}
      aria-label={copied ? "คัดลอกแล้ว" : "คัดลอกโค้ด"}
      onClick={async () => {
        await navigator.clipboard.writeText(value)
        setCopied(true)
      }}
    >
      <Icon as={CopyIcon} activeAs={CheckCircleIcon} active={copied} className={copied ? "text-success" : undefined} />
    </Button>
  )
}
