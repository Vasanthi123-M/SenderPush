

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";

// function withCors(res) {
//   res.headers.set("Access-Control-Allow-Origin", "*");
//   res.headers.set("Access-Control-Allow-Methods", "GET,OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type");
//   return res;
// }

// export async function OPTIONS() {
//   return withCors(NextResponse.json({}, { status: 200 }));
// }

// export async function GET() {
//   try {
//     await connectDB();
//     const users = await User.find({ token: { $exists: true, $ne: null } })
//       .select({ name: 1, email: 1, token: 1 })
//       .sort({ updatedAt: -1 })
//       .lean();
//     return withCors(NextResponse.json({ success: true, users }));
//   } catch (e) {
//     return withCors(NextResponse.json({ success: false, error: e.message }, { status: 500 }));
//   }
// // }


// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import { withCors, handleOptions } from "@/lib/cors";

// export async function OPTIONS(req) {
//   return handleOptions(req);
// }

// export async function GET(req) {
//   try {
//     await connectDB();
//     const users = await User.find({ token: { $exists: true, $ne: null } })
//       .select({ name: 1, email: 1, token: 1 })
//       .sort({ updatedAt: -1 })
//       .lean();
//     return withCors(req, NextResponse.json({ success: true, users }));
//   } catch (err) {
//     return withCors(req, NextResponse.json({ success: false, error: err.message }, { status: 500 }));
//   }
// }


import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { withCors, handleOptions } from "@/lib/cors";

export async function OPTIONS(req) {
  return handleOptions(req);
}

// Get all users with token
export async function GET(req) {
  try {
    await connectDB();
    const users = await User.find({ token: { $exists: true, $ne: null } })
      .select({ name: 1, email: 1, token: 1 })
      .sort({ updatedAt: -1 })
      .lean();
console.log("Tokens in DB:", users.map(u => u.token));

    return withCors(req, NextResponse.json({ success: true, users }));
  } catch (err) {
    return withCors(req, NextResponse.json({ success: false, error: err.message }, { status: 500 }));
  }
}
