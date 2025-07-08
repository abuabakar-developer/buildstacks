import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import Company from '@/models/Company';
import { generateToken } from '@/utils/jwt';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { email, password } = body;

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    try {
      // Check password
      const isPasswordValid = await user.comparePassword(password);
      if (!isPasswordValid) {
        return NextResponse.json(
          { error: 'Invalid email or password' },
          { status: 401 }
        );
      }
    } catch (error: any) {
      console.error('Password comparison error:', error);
      return NextResponse.json(
        { error: 'Authentication error' },
        { status: 401 }
      );
    }

    // Fetch company info
    const company = user.companyId ? await Company.findById(user.companyId) : null;

    // Generate JWT token
    const token = generateToken({ 
      userId: user._id.toString(), 
      email: user.email, 
      companyId: user.companyId, 
      role: user.role 
    });

    // Create response with cookie
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phone: user.phone,
          email: user.email,
          country: user.country,
          businessType: user.businessType,
          constructionVolume: user.constructionVolume,
          companyId: user.companyId,
          role: user.role,
          company: company ? { id: company._id, name: company.name } : null,
        }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;

  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 