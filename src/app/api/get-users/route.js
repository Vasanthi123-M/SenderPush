

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function withCors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}, { status: 200 }));
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({ token: { $exists: true, $ne: null } })
      .select({ name: 1, email: 1, token: 1 })
      .sort({ updatedAt: -1 })
      .lean();
    return withCors(NextResponse.json({ success: true, users }));
  } catch (e) {
    return withCors(NextResponse.json({ success: false, error: e.message }, { status: 500 }));
  }
}
