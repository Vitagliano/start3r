"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { CodeBlock } from "@/components/code/CodeBlock"

type ClientCodeSectionProps = {
  title: string
  file: string // project-root relative path
}

export function ClientCodeSection ({ title, file }: ClientCodeSectionProps) {
  const [code, setCode] = useState<string>("// Loading...")

  useEffect(() => {
    let isMounted = true
    fetch(`/api/code?file=${encodeURIComponent(file)}`)
      .then(async (r) => (r.ok ? r.text() : "// Failed to load code"))
      .then((txt) => { if (isMounted) setCode(txt) })
      .catch(() => { if (isMounted) setCode("// Failed to load code") })
    return () => { isMounted = false }
  }, [file])

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h4 className="mb-3 font-semibold">{title}</h4>
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  )
}


