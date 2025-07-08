import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Invitation from '@/models/Invitation';
import Project from '@/models/Project';
import User from '@/models/User';
import { sendEmail } from '@/utils/nodemailer';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await dbConnect();
  const { email, role } = await request.json();
  const { id: projectId } = await params;

  if (!email || !role) {
    return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
  }

  // Find the project to get companyId
  const project = await Project.findById(projectId);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }

  // Check if user already exists
  let user = await User.findOne({ email });
  if (user) {
    // Add user to project members if not already added
    if (!project.members.includes(user._id)) {
      project.members.push(user._id);
      await project.save();
    }
    // Send invitation email even if user exists
    try {
      const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?invite=${project._id}`;
      console.log('📧 Sending invitation email for project:', project.name);
      await sendEmail(email, 'projectInvitation', {
        projectName: project.name || 'Construction Project',
        inviteLink: inviteLink,
        invitedBy: 'Your Team Lead'
      });
    } catch (e) {
      console.error('Email sending failed:', e);
      return NextResponse.json({ error: 'User added, but failed to send email.' }, { status: 500 });
    }
    return NextResponse.json({ success: true, message: 'User already exists, was added to the project, and invitation email sent.' }, { status: 200 });
  }

  // Create an invitation entry with companyId
  const invitation = await Invitation.create({
    projectId,
    companyId: project.companyId,
    email,
    role,
    status: 'pending',
    invitedAt: new Date(),
  });

  // Send invitation email using Nodemailer
  try {
    const inviteLink = `${process.env.NEXT_PUBLIC_BASE_URL}/signup?invite=${project._id}`;
    console.log('📧 Sending invitation email for project:', project.name);
    await sendEmail(email, 'projectInvitation', {
      projectName: project.name || 'Construction Project',
      inviteLink: inviteLink,
      invitedBy: 'Your Team Lead'
    });
  } catch (e) {
    console.error('Email sending failed:', e);
    return NextResponse.json({ error: 'Invitation created, but failed to send email.' }, { status: 500 });
  }

  return NextResponse.json({ success: true, invitation }, { status: 201 });
} 