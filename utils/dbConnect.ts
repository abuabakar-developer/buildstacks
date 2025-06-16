// lib/dbConnect.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URL!;
if (!MONGO_URI) throw new Error("Define MONGO_URL");

declare global {
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}
let cached = global.mongoose ||= { conn: null, promise: null };

export default async function dbConnect() {
  if (cached.conn) return cached.conn;
  cached.promise = mongoose.connect(MONGO_URI).then((m) => m.connection);
  cached.conn = await cached.promise;
  return cached.conn;
}
