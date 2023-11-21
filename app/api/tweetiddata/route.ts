import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import SentDmDetails from "@/models/senddmmodel";
import UnsentDmDetails from "@/models/unsenddmmodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const { timeperiod, id } = bodyData;

  await connectDB();
  const sentDmUserData = await SentDmDetails.find({
    tweetID: id,
    timestamp: timeperiod,
  });

  const unsentDmUserData = await UnsentDmDetails.find({
    tweetID: id,
    timestamp: timeperiod,
  });

  console.log(sentDmUserData);
  console.log(unsentDmUserData);

  return NextResponse.json({ success: true,  sentDmUserData, unsentDmUserData });
}
