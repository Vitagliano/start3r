import fs from "fs/promises";
import path from "path";
import { Card, CardContent } from "@/components/ui/card";
import { CodeBlock } from "@/components/code/CodeBlock";

type CodeSectionProps = {
  title: string;
  file: string; // absolute or project-root relative path
};

export async function CodeSection({ title, file }: CodeSectionProps) {
  const projectRoot = process.cwd();
  const absolute = path.isAbsolute(file) ? file : path.join(projectRoot, file);
  let code = "// File not found";
  try {
    code = await fs.readFile(absolute, "utf8");
  } catch {}

  return (
    <Card className="mt-8">
      <CardContent className="p-6">
        <h4 className="mb-3 font-semibold">{title}</h4>
        {/* Do not syntax highlight to avoid heavy client bundles */}
        {/* Keep tiny font and overflow handling for large files */}
        <CodeBlock code={code} />
      </CardContent>
    </Card>
  );
}
