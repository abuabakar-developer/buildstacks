import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Task from '@/models/Task';

// GET /api/projects/[id]/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest, 
  context: Promise<{ params: { id: string; taskId: string } }>
) {
  await dbConnect();
  const { params } = await context;
  const task = await Task.findById(params.taskId).populate('assignee');
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  return NextResponse.json(task);
}

// PATCH /api/projects/[id]/tasks/[taskId] - Update a task
export async function PATCH(
  request: NextRequest, 
  context: Promise<{ params: { id: string; taskId: string } }>
) {
  await dbConnect();
  const { params } = await context;
  const updateData = await request.json();
  
  // Validate the task exists and belongs to the project
  const task = await Task.findById(params.taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  if (task.projectId.toString() !== params.id) {
    return NextResponse.json({ error: 'Task does not belong to this project' }, { status: 403 });
  }

  // Update the task
  const updatedTask = await Task.findByIdAndUpdate(
    params.taskId,
    updateData,
    { new: true, runValidators: true }
  ).populate('assignee');

  return NextResponse.json(updatedTask);
}

// DELETE /api/projects/[id]/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest, 
  context: Promise<{ params: { id: string; taskId: string } }>
) {
  await dbConnect();
  const { params } = await context;
  
  // Validate the task exists and belongs to the project
  const task = await Task.findById(params.taskId);
  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }
  
  if (task.projectId.toString() !== params.id) {
    return NextResponse.json({ error: 'Task does not belong to this project' }, { status: 403 });
  }

  await Task.findByIdAndDelete(params.taskId);
  return NextResponse.json({ message: 'Task deleted successfully' });
} 