import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Email transporter configuration - only create if credentials are available
let transporter: nodemailer.Transporter | null = null;

if (process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASS) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASS,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      company,
      country,
      businessType,
      constructionVolume,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !country || !businessType || !constructionVolume) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Send email to admin/team
    const adminEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🎉 New Demo Request - BuildStack
        </h2>
        
        <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Contact Information</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Country:</strong> ${country}</p>
        </div>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Business Details</h3>
          <p><strong>Business Type:</strong> ${businessType}</p>
          <p><strong>Construction Volume:</strong> ${constructionVolume}</p>
        </div>
        
        <div style="background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #92400e;">
            <strong>Action Required:</strong> Please contact this prospect within 24 hours to schedule their demo.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="mailto:${email}?subject=BuildStack Demo Request - Let's Schedule Your Demo" 
             style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            Reply to Prospect
          </a>
        </div>
        
        <p style="color: #6b7280; font-size: 14px; margin-top: 30px; text-align: center;">
          This demo request was submitted from the BuildStack website.
        </p>
      </div>
    `;

    // Send confirmation email to the user
    const userEmailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #1f2937; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🚀 Thank You for Your Demo Request - BuildStack
        </h2>
        
        <p>Hi ${firstName},</p>
        
        <p>Thank you for your interest in BuildStack! We've received your demo request and our team will be in touch with you within 24 hours to schedule your personalized demo.</p>
        
        <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">Your Request Details</h3>
          <p><strong>Name:</strong> ${firstName} ${lastName}</p>
          <p><strong>Company:</strong> ${company}</p>
          <p><strong>Business Type:</strong> ${businessType}</p>
          <p><strong>Construction Volume:</strong> ${constructionVolume}</p>
        </div>
        
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #374151; margin-top: 0;">What to Expect</h3>
          <ul style="color: #065f46;">
            <li>Our team will contact you within 24 hours</li>
            <li>We'll schedule a 30-minute personalized demo</li>
            <li>You'll see how BuildStack can streamline your construction projects</li>
            <li>We'll answer all your questions about features and pricing</li>
          </ul>
        </div>
        
        <p>In the meantime, if you have any questions, feel free to reply to this email or contact us at <a href="mailto:support@buildstack.com" style="color: #3b82f6;">support@buildstack.com</a>.</p>
        
        <p>Best regards,<br>The BuildStack Team</p>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            BuildStack - Construction Management Platform<br>
            <a href="https://buildstack.com" style="color: #3b82f6;">buildstack.com</a>
          </p>
        </div>
      </div>
    `;

    // Send emails if transporter is configured
    if (transporter) {
      try {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@buildstack.com';
        
        // Send to admin
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
          to: adminEmail,
          subject: `🎉 New Demo Request - ${firstName} ${lastName} from ${company}`,
          html: adminEmailContent,
        });

        // Send confirmation to user
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER,
          to: email,
          subject: '🚀 Thank You for Your BuildStack Demo Request',
          html: userEmailContent,
        });

        console.log(`✅ Emails sent successfully for demo request from ${firstName} ${lastName}`);
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        // Continue with success response even if email fails
      }
    } else {
      console.log('⚠️ Email not configured - demo request logged without email notification');
    }

    // Log the demo request (you can also save to database here)
    console.log(`📝 Demo request received from ${firstName} ${lastName} (${email}) from ${company}`);
    console.log(`📊 Business Type: ${businessType}, Volume: ${constructionVolume}`);

    const responseMessage = transporter 
      ? 'Demo request submitted successfully! We\'ll be in touch within 24 hours.'
      : 'Demo request submitted successfully! (Email notifications not configured)';

    return NextResponse.json(
      { 
        success: true, 
        message: responseMessage,
        emailConfigured: !!transporter
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing demo request:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process demo request. Please try again or contact support.' 
      },
      { status: 500 }
    );
  }
}

// Handle GET requests (optional - for testing)
export async function GET() {
  return NextResponse.json(
    { message: 'Book Demo API endpoint is working' },
    { status: 200 }
  );
} 