

// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import admin from "@/lib/firebaseAdmin";

// export async function POST(req) {
//   try {
//     await connectDB();
//     const { mode, tokens = [], title = "Notification", body: text = "" } = await req.json();

//     let targetTokens = [];

//     if (mode === "broadcast") {
//       const users = await User.find({ token: { $exists: true, $ne: null } }).select("token").lean();
//       targetTokens = users.map(u => u.token);
//     } else {
//       targetTokens = tokens;
//     }

//     if (!targetTokens.length) return NextResponse.json({ success: false, error: "No tokens" }, { status: 400 });

//     const message = {
//       data: { title, body: text, url: "http://localhost:3001/Home" },
//       tokens: targetTokens,
//     };

//     const response = await admin.messaging().sendEachForMulticast(message);

//     return NextResponse.json({ success: true, count: response.successCount });
//   } catch (err) {
//     console.error("send-notification error:", err);
//     return NextResponse.json({ success: false, error: err.message }, { status: 500 });
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import admin from "@/lib/firebaseAdmin";
import { withCors, handleOptions } from "@/lib/cors";

export async function OPTIONS(req) {
  return handleOptions(req);
}

export async function POST(req) {
  try {
    await connectDB();
    const { mode, tokens = [], title = "Notification", body: text = "" } = await req.json();

    let targetTokens = [];

    if (mode === "broadcast") {
      const users = await User.find({ token: { $exists: true, $ne: null } }).select("token").lean();
      targetTokens = users.map(u => u.token);
    } else {
      targetTokens = tokens;
    }

    if (!targetTokens.length)
      return withCors(req, NextResponse.json({ success: false, error: "No tokens" }, { status: 400 }));

    const message = {
      data: { title, body: text, url: process.env.RECEIVER_URL + "/Home" },
      tokens: targetTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return withCors(req, NextResponse.json({ success: true, count: response.successCount }));
  } catch (err) {
    console.error("send-notification error:", err);
    return withCors(req, NextResponse.json({ success: false, error: err.message }, { status: 500 }));
  }
}
