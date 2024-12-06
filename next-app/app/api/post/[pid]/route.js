import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  const { pid } = await params
  return NextResponse.json(`recomp post /api/post Post: ${pid}`)
}