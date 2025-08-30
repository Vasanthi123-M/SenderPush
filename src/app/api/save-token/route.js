import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withCors, handleOptions } from "@/lib/cors";

// ⚠ Handle OPTIONS preflight
export async function OPTIONS(req) {
  return handleOptions(req);
}

// POST - save or update user token
export async function POST(req) {
  try {
    await connectDB();

    const { name, email, token } = await req.json();

    if (!name || !token) {
      return withCors(
        req,
        NextResponse.json(
          { success: false, error: "name and token required" },
          { status: 400 }
        )
      );
    }

    // Use email if available, otherwise token as filter
    const filter = email ? { email } : { token };
    const update = { name, email, token, createdAt: new Date() };

    // Upsert user
    const doc = await User.findOneAndUpdate(filter, update, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    });

    return withCors(req, NextResponse.json({ success: true, user: doc }));
  } catch (err) {
    return withCors(
      req,
      NextResponse.json({ success: false, error: err.message }, { status: 500 })
    );
  }
}
