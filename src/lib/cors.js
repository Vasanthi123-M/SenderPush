// lib/cors.js
import { NextResponse } from "next/server";

// Read allowed origins from env variable (comma separated)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",").map((o) => o.trim())
  : [];

export function withCors(req, res) {
  const origin = req.headers.get("origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.headers.set("Access-Control-Allow-Origin", origin); // ✅ dynamic
  } else {
    res.headers.set("Access-Control-Allow-Origin", "null"); // block unknown origins
  }

  res.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true"); // optional

  return res;
}

// Handle preflight OPTIONS request
export function handleOptions(req) {
  return withCors(req, NextResponse.json({}, { status: 200 }));
}
