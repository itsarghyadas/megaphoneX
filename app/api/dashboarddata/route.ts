import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TwitterForm from "@/models/twittermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  const { userId } = bodyData;

  await connectDB();
  const userForms = await TwitterForm.find({ userID: userId });
  return NextResponse.json({ success: true, data: userForms });
}
