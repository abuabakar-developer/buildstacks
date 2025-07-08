import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/utils/dbConnect";
import Project from "@/models/Project";

// PATCH: Update member role
export async function PATCH(req: NextRequest, context: { params: { id: string, memberId: string } }) {
  await dbConnect();
  const { id, memberId } = context.params;
  const { role } = await req.json();

  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const member = project.members.find((m: any) => m._id.toString() === memberId);
  if (!member) return NextResponse.json({ error: "Member not found" }, { status: 404 });

  member.role = role;
  // Ensure owner is not removed or changed
  if (!project.owner) return NextResponse.json({ error: "Project owner missing" }, { status: 500 });

  await project.save();

  return NextResponse.json({ success: true, member });
}

// DELETE: Remove member
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string; memberId: string } }
) {
  await dbConnect();
  const { id, memberId } = context.params;

  const project = await Project.findById(id);
  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Prevent removing the owner
  if (project.owner.toString() === memberId) {
    return NextResponse.json({ error: "Cannot remove the project owner" }, { status: 400 });
  }

  project.members = project.members.filter((m: any) => m._id.toString() !== memberId);

  // Ensure owner is not removed
  if (!project.owner) return NextResponse.json({ error: "Project owner missing" }, { status: 500 });

  await project.save();

  return NextResponse.json({ success: true });
} 



