import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import DmDetails from "@/models/dmmodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  const { timeperiod, id } = bodyData;

  await connectDB();
  const tweetData = await DmDetails.find({
    tweetID: id,
    timestamp: timeperiod,
  });
  return NextResponse.json({ success: true, data: tweetData });
}
