import { NextResponse } from "next/server";
import supabase from "@/db/initSupabase";
import type { userReport } from '@/types/types'

export async function GET() {
  const { data, error } = await supabase.from('reports').select()
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const report:userReport = await request.json()
  const { data, error } = await supabase.from('reports').insert([{ report_time: report.report_time, city:report.location.city, region:report.location.region, postCode: parseInt(report.location.postCode) }])
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json(data);
}