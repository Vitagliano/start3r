import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

export async function GET (req: Request) {
  const url = new URL(req.url)
  const file = url.searchParams.get("file")
  if (!file) return NextResponse.json({ error: "Missing file" }, { status: 400 })

  const projectRoot = process.cwd()
  const resolved = path.normalize(path.join(projectRoot, file))

  // security: only allow reading within project src
  const allowedRoot = path.join(projectRoot, "src")
  if (!resolved.startsWith(allowedRoot)) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 })
  }

  try {
    const code = await fs.readFile(resolved, "utf8")
    return new NextResponse(code, { status: 200, headers: { "content-type": "text/plain; charset=utf-8" } })
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}


