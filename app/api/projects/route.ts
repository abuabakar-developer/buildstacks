import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Project from '@/models/Project';
import Pusher from 'pusher';
import User from '@/models/User';
import { verifyToken } from '@/utils/jwt';

export async function GET(request: NextRequest) {
  await dbConnect();
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get('companyId');
  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }
  const projects = await Project.find({ companyId }).populate('members');
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { name, desc, companyId } = await request.json();
  console.log('📡 API: Creating project:', { name, desc, companyId });
  
  // Get user from auth token
  const token = request.cookies.get('auth-token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'No authentication token found' }, { status: 401 });
  }
  const decoded = verifyToken(token);
  const user = await User.findById(decoded.userId);
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 401 });
  }
  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }
  
  // Check if a project with the same name already exists for this company
  const existingProject = await Project.findOne({ name: name.trim(), companyId });
  if (existingProject) {
    console.log('⚠️ API: Project with same name already exists:', name);
    return NextResponse.json({ error: 'A project with this name already exists in your company' }, { status: 409 });
  }
  
  const project = await Project.create({ name, desc, companyId, owner: user._id, members: [user._id] });
  console.log('✅ API: Project created successfully:', project.name, 'ID:', project._id);

  // Pusher logic
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });
  await pusher.trigger('projects', 'project-created', { project });
  console.log('📡 API: Pusher event triggered for project:', project.name);

  return NextResponse.json(project, { status: 201 });
} 