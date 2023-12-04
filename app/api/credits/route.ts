import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/usermodel";

export async function POST(request: NextRequest) {
  const bodyData = await request.json();
  console.log(bodyData);
  const { userId } = bodyData;

  await connectDB();
  const userData = await User.find({ user_id: userId });
  const credits = userData[0].credits;
  console.log("checked credits", credits);

  return NextResponse.json({ success: true, credits: credits });
}
