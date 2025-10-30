"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type CodeBlockProps = {
  code: string;
  initiallyCollapsedLines?: number;
};

export function CodeBlock({
  code,
  initiallyCollapsedLines = 18,
}: CodeBlockProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const displayed = useMemo(() => {
    if (isExpanded) return code;
    const lines = code.split("\n");
    if (lines.length <= initiallyCollapsedLines) return code;
    return lines.slice(0, initiallyCollapsedLines).join("\n");
  }, [code, initiallyCollapsedLines, isExpanded]);

  const hasMore = useMemo(
    () => code.split("\n").length > initiallyCollapsedLines,
    [code, initiallyCollapsedLines]
  );

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for non-secure contexts or older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.top = "-1000px";
        textArea.style.left = "-1000px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      toast({ description: "Code copied to clipboard" });
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch (err: any) {
      toast({ description: "Failed to copy code" });
    }
  };

  return (
    <div className="w-full">
      <div className="relative rounded-md border bg-muted p-3">
        <pre className="max-h-[480px] overflow-auto text-xs leading-relaxed">
          {displayed}
        </pre>

        <div className="relative mt-2">
          {/* subtle gradient shadow above controls bar */}
          <div className="flex items-center gap-2" aria-live="polite">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleCopy}
              disabled={copied}>
              {copied ? "Copied" : "Copy"}
            </Button>
            {hasMore ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? "Show less" : "Show more"}
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
