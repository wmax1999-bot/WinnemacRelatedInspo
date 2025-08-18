import { NextResponse } from "next/server";

/**
 * ShowMojo Proxy (stub)
 * Replace this with your real ShowMojo fetch once you have the correct endpoint/token.
 * Example pattern:
 *   const res = await fetch(`${process.env.SHOWMOJO_BASE_URL}/listings?token=${process.env.SHOWMOJO_API_KEY}`, { cache: "no-store" });
 *   const data = await res.json();
 *   return NextResponse.json(data);
 */
export async function GET() {
  return NextResponse.json(
    { message: "ShowMojo proxy not configured yet. Add SHOWMOJO_BASE_URL and SHOWMOJO_API_KEY, then implement the fetch here." },
    { status: 501 }
  );
}
