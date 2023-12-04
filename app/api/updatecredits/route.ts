import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/usermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const { userId, lossCredits } = bodyData;

  await connectDB();
  const updatedUser = await User.findOneAndUpdate(
    { user_id: userId },
    { $inc: { credits: -lossCredits } },
    { new: true }
  );

  return NextResponse.json({ success: true, updatedUser: updatedUser });
}
