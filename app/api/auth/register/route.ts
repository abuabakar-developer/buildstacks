import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/dbConnect";
import { User } from "@/models/User";

export async function POST(req: Request) {
  const { name, email, password } = await req.json();
  await dbConnect();

  if (await User.findOne({ email })) {
    return NextResponse.json({ message: "User already exists" }, { status: 400 });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  return NextResponse.json({ id: user._id, name: user.name, email: user.email }, { status: 201 });
}
