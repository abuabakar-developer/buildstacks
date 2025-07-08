import { NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';

export async function GET() {
  try {
    await dbConnect();
    
    const envCheck = {
      MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not set',
      JWT_SECRET: process.env.JWT_SECRET ? 'Set' : 'Not set',
      NODE_ENV: process.env.NODE_ENV || 'development',
    };

    return NextResponse.json({
      message: 'Test successful',
      timestamp: new Date().toISOString(),
      environment: envCheck,
      status: 'Connected to MongoDB successfully'
    });

  } catch (error: any) {
    console.error('Test API error:', error);
    return NextResponse.json({
      error: error.message,
      timestamp: new Date().toISOString(),
      status: 'Failed to connect to MongoDB'
    }, { status: 500 });
  }
} 