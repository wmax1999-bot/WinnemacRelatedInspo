import { NextResponse } from "next/server";
import { getAllProperties } from "@/lib/data";

export async function GET() {
  const properties = await getAllProperties();
  return NextResponse.json({ properties });
}
