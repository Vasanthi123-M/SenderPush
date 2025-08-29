import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

function withCors(res) {
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type");
  return res;
}

export async function OPTIONS() {
  return withCors(NextResponse.json({}, { status: 200 }));
}

export async function POST(req) {
  try {
    await connectDB();
    const { name, email, token } = await req.json();

    if (!name || !token) {
      return withCors(
        NextResponse.json({ success: false, error: "name and token required" }, { status: 400 })
      );
    }

    const filter = email ? { email } : { token };
    const update = { name, email, token, createdAt: new Date() };

    const doc = await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });

    return withCors(NextResponse.json({ success: true, user: doc }));
  } catch (err) {
    return withCors(NextResponse.json({ success: false, error: err.message }, { status: 500 }));
  }
}
