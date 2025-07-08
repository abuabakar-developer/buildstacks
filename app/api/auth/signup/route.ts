import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/utils/dbConnect';
import User from '@/models/User';
import Company from '@/models/Company';
import Invitation from '@/models/Invitation';
import { generateToken } from '@/utils/jwt';
import Project from '@/models/Project';
import OpenAI from "openai";

// Map business type IDs to full names
const businessTypeMap: { [key: string]: string } = {
  'residential-home': 'Residential Home Builder',
  'residential-remodeler': 'Residential Remodeler',
  'commercial-contractor': 'Commercial General Contractor',
  'specialty-contractor': 'Specialty/Trade Contractor',
};

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { firstName, lastName, phone, email, password, country, businessType, constructionVolume, companyName, name, desc } = body;

    console.log('Received signup request:', { firstName, lastName, email, country, businessType, constructionVolume });

    // Validate required fields
    if (!firstName || !lastName || !email || !password || !country || !businessType || !constructionVolume) {
      console.log('Missing required fields:', { firstName, lastName, email, password, country, businessType, constructionVolume });
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Map business type ID to full name (for display only, not for saving in User)
    // const mappedBusinessType = businessTypeMap[businessType] || businessType;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Invitation logic
    let company, role = 'member';
    const invitation = await Invitation.findOne({ email, status: 'pending' });
    if (invitation) {
      company = await Company.findById(invitation.companyId);
      role = invitation.role;
      invitation.status = 'accepted';
      await invitation.save();
    } else {
      if (!companyName) {
        return NextResponse.json(
          { error: 'Company name is required for new company' },
          { status: 400 }
        );
      }
      // Trim company name and check for duplicates
      const trimmedCompanyName = companyName.trim();
      const existingCompany = await Company.findOne({ name: trimmedCompanyName });
      if (existingCompany) {
        return NextResponse.json(
          { error: 'A company with this name already exists. Please use a different name.' },
          { status: 400 }
        );
      }
      company = new Company({ name: trimmedCompanyName, members: [] });
      await company.save();
      role = 'admin';
    }

    // Create new user (save businessType as the ID, not the full name)
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      phone,
      country,
      businessType, // <-- use the ID directly
      constructionVolume,
      companyId: company._id,
      role,
    });
    await user.save();

    // Add user to company members
    company.members.push({ userId: user._id, role, status: 'active' });
    await company.save();

    // Generate JWT token
    const token = generateToken({ userId: user._id.toString(), email: user.email, companyId: company._id, role });

    // Create response with cookie
    const response = NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          country: user.country,
          businessType: user.businessType,
          constructionVolume: user.constructionVolume,
          companyId: user.companyId,
          role: user.role,
          ...(phone && { phone })
        }
      },
      { status: 201 }
    );

    // Set HTTP-only cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    // Create project
    const project = await Project.create({ name, desc });

    const summary = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: `Summarize this project: ${desc}` }],
      max_tokens: 60,
    });

    return response;

  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 