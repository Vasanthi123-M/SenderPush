// import { NextResponse } from "next/server";
// import admin from "@/lib/firebaseAdmin";
// import connectDB from "@/lib/mongodb";
// import User from "@/models/User";
// import Link from "next/link";

// function withCors(res) {
//   res.headers.set("Access-Control-Allow-Origin", "*");
//   res.headers.set("Access-Control-Allow-Methods", "POST,OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type");
//   return res;
// }

// export async function OPTIONS() {
//   return withCors(NextResponse.json({}, { status: 200 }));
// }

// export async function POST(req) {
//   try {
//     await connectDB();
//     const body = await req.json();
//     const { mode, tokens = [], title = "Notification", body: text = "" } = body;

//     let targetTokens = [];

//     if (mode === "broadcast") {
//       // 🌍 fetch all tokens from DB
//       const users = await User.find({ token: { $exists: true, $ne: null } }).select("token").lean();
//       targetTokens = users.map(u => u.token);
//     } else {
//       // single or multiple selection
//       targetTokens = tokens;
//     }

//     if (!targetTokens.length) {
//       return withCors(
//         NextResponse.json({ success: false, error: "No tokens to send" }, { status: 400 })
//       );
//     }

//     const message = {
//       notification: { title, body: text },
//       webpush: { fcmOptions: { link: "http://localhost:3001/Home" } },
      

//       tokens: targetTokens,
//     };

//     // ✅ use sendEachForMulticast
//     const response = await admin.messaging().sendEachForMulticast(message);

//     return withCors(
//       NextResponse.json({ success: true, count: response.successCount, results: response.responses })
//     );
//   } catch (err) {
//     console.error("send-notification error:", err);
//     return withCors(
//       NextResponse.json({ success: false, error: err.message }, { status: 500 })
//     );
//   }
// }

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import admin from "@/lib/firebaseAdmin";

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

    if (!targetTokens.length) return NextResponse.json({ success: false, error: "No tokens" }, { status: 400 });

    const message = {
      data: { title, body: text, url: "http://localhost:3001/Home" },
      tokens: targetTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(message);

    return NextResponse.json({ success: true, count: response.successCount });
  } catch (err) {
    console.error("send-notification error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
