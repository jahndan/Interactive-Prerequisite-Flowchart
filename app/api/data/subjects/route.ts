import type { NextRequest } from "next/server";

import data from "@/app/db/UMNTC/allSubjects.json";

export async function GET(req: Request) {
  return Response.json(data);
}
