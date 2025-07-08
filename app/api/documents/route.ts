import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import Document from '@/models/Document';
import Pusher from 'pusher';
import fs from 'fs';
import OpenAI from 'openai';

export const config = {
  api: {
    bodyParser: false,
  },
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(request: NextRequest) {
  await dbConnect();
  const url = new URL(request.url);
  const companyId = url.searchParams.get('companyId');
  let query = {};
  if (companyId) query = { companyId };
  const documents = await Document.find(query).sort({ date: -1 });
  return NextResponse.json(documents);
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const formData = await request.formData();
  const file = formData.get('file');
  const companyId = formData.get('companyId');
  const projectId = formData.get('projectId');
  const uploadedBy = formData.get('uploadedBy') || 'Unknown';

  if (!companyId) {
    return NextResponse.json({ error: 'companyId is required' }, { status: 400 });
  }
  if (!projectId) {
    return NextResponse.json({ error: 'projectId is required' }, { status: 400 });
  }
  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Read file content as Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  let extractedText = '';
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant that summarizes documents.' },
        { role: 'user', content: `Summarize the following document:\n${buffer.toString('utf-8').slice(0, 4000)}` },
      ],
      max_tokens: 256,
    });
    extractedText = completion.choices[0].message?.content || '';
  } catch (e) {
    extractedText = 'OpenAI summary failed.';
  }

  // Save document metadata, file data, and summary
  const document = await Document.create({
    name: file.name,
    type: file.type,
    companyId,
    projectId,
    size: buffer.length,
    status: 'pending',
    url: '', // You can add file storage logic here if needed
    summary: extractedText,
    date: new Date(),
    uploadedBy,
    data: buffer, // Store file data as Buffer
  });

  // Pusher logic
  const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.PUSHER_KEY!,
    secret: process.env.PUSHER_SECRET!,
    cluster: process.env.PUSHER_CLUSTER!,
    useTLS: true,
  });
  await pusher.trigger('documents', 'document-uploaded', { document });
  return NextResponse.json(document, { status: 201 });
} 