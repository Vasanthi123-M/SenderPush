// import mongoose from "mongoose";

// let cached = global._sender_mongoose;
// if (!cached) cached = global._sender_mongoose = { conn: null, promise: null };

// export default async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     const uri = process.env.MONGODB_URI;
//     if (!uri) throw new Error("MONGODB_URI not set");
//     cached.promise = mongoose.connect(uri, { dbName: "notifications" }).then(m => m);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

import mongoose from "mongoose";

let cached = global._sender_mongoose;
if (!cached) cached = global._sender_mongoose = { conn: null, promise: null };

export default async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI not set");
    cached.promise = mongoose.connect(uri, { dbName: "notifications" }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
