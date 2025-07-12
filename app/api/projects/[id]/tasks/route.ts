import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Task from '@/models/Task';

// GET /api/projects/[id]/tasks - List all tasks for a project
export async function GET(request: NextRequest, context: Promise<{ params: { id: string } }>) {
  await dbConnect();
  const { params } = await context;
  const tasks = await Task.find({ projectId: params.id }).populate('assignee');
  return NextResponse.json(tasks);
}

// POST /api/projects/[id]/tasks - Create a new task for a project
export async function POST(request: NextRequest, context: Promise<{ params: { id: string } }>) {
  await dbConnect();
  const { params } = await context;
  const { title, description, status, assignee, dueDate } = await request.json();
  if (!title) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }
  const taskData: any = {
    title,
    description,
    status: status || 'todo',
    dueDate,
    projectId: params.id,
  };
  if (assignee && assignee !== "") {
    taskData.assignee = assignee;
  }
  const task = await Task.create(taskData);
  await task.populate('assignee');
  return NextResponse.json(task, { status: 201 });
} 