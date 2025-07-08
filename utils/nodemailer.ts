import nodemailer from 'nodemailer';

// Create transporter with better configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER,
    pass: process.env.EMAIL_SERVER_PASS || process.env.EMAIL_PASS,
  },
  secure: true, // Use SSL
  port: 465, // Gmail SMTP port
  tls: {
    rejectUnauthorized: false
  }
});

// Check if email credentials are configured
if (!process.env.EMAIL_SERVER_USER && !process.env.EMAIL_USER) {
  console.warn('⚠️ Email credentials not configured. Please set EMAIL_SERVER_USER and EMAIL_SERVER_PASS in your .env.local file');
} else {
  console.log('✅ Email credentials found. Nodemailer is ready to send emails.');
  console.log('📧 Using email:', process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER);
  // Verify transporter on startup
  transporter.verify()
    .then(() => console.log('✅ Nodemailer transporter verified successfully'))
    .catch((err: any) => console.error('❌ Nodemailer transporter verification failed:', err));
}

// Email templates
export const emailTemplates = {
  projectInvitation: (projectName: string, inviteLink: string, invitedBy: string) => ({
    subject: `You're invited to join ${projectName} on BuildStack!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Project Invitation - BuildStack</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏗️ BuildStack</div>
            <h1>Project Invitation</h1>
          </div>
          <div class="content">
            <h2>You've been invited!</h2>
            <p>Hello there! 👋</p>
            <p><strong>${invitedBy}</strong> has invited you to join the project <strong>${projectName}</strong> on BuildStack.</p>
            <p>BuildStack is a comprehensive construction management platform that helps teams collaborate on projects, manage documents, and track progress efficiently.</p>
            
            <div style="text-align: center;">
              <a href="${inviteLink}" class="button">Accept Invitation</a>
            </div>
            
            <p><strong>What you'll get access to:</strong></p>
            <ul>
              <li>📋 Project management tools</li>
              <li>📄 Document management</li>
              <li>👥 Team collaboration</li>
              <li>📊 Progress tracking</li>
              <li>🔒 Secure file sharing</li>
            </ul>
            
            <p>If you have any questions, feel free to reach out to your team lead.</p>
          </div>
          <div class="footer">
            <p>This invitation was sent from BuildStack - Construction Management Platform</p>
            <p>If you didn't expect this invitation, you can safely ignore this email.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      You've been invited to join ${projectName} on BuildStack!
      
      ${invitedBy} has invited you to collaborate on this construction project.
      
      Click here to accept: ${inviteLink}
      
      BuildStack - Construction Management Platform
    `
  }),

  welcomeEmail: (userName: string, companyName: string) => ({
    subject: `Welcome to BuildStack, ${userName}!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to BuildStack</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏗️ BuildStack</div>
            <h1>Welcome aboard!</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName}! 👋</h2>
            <p>Welcome to <strong>BuildStack</strong> - your new construction management platform!</p>
            <p>You're now part of <strong>${companyName}</strong> and have access to powerful tools to manage your construction projects efficiently.</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Go to Dashboard</a>
            </div>
            
            <p><strong>What you can do now:</strong></p>
            <ul>
              <li>🏗️ Create and manage construction projects</li>
              <li>📄 Upload and organize project documents</li>
              <li>👥 Invite team members to collaborate</li>
              <li>📊 Track project progress and analytics</li>
              <li>🔒 Keep your data secure and organized</li>
            </ul>
            
            <p>If you need help getting started, check out our quick start guide or contact our support team.</p>
          </div>
          <div class="footer">
            <p>BuildStack - Construction Management Platform</p>
            <p>Thank you for choosing us for your construction management needs!</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Welcome to BuildStack, ${userName}!
      
      You're now part of ${companyName} and have access to powerful construction management tools.
      
      Get started: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard
      
      BuildStack - Construction Management Platform
    `
  }),

  paymentSuccess: (userName: string, amount: string) => ({
    subject: `Payment Successful - Welcome to BuildStack Pro!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Successful - BuildStack Pro</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          .logo { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .success-icon { font-size: 48px; margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">🏗️ BuildStack Pro</div>
            <div class="success-icon">✅</div>
            <h1>Payment Successful!</h1>
          </div>
          <div class="content">
            <h2>Congratulations ${userName}! 🎉</h2>
            <p>Your payment of <strong>${amount}</strong> has been processed successfully.</p>
            <p>You now have access to <strong>BuildStack Pro</strong> with unlimited features!</p>
            
            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" class="button">Access Pro Features</a>
            </div>
            
            <p><strong>Your Pro benefits:</strong></p>
            <ul>
              <li>♾️ Unlimited construction projects</li>
              <li>📊 Advanced analytics and reporting</li>
              <li>👥 Priority support and training</li>
              <li>📄 Enhanced document management</li>
              <li>🔒 Advanced security features</li>
            </ul>
            
            <p>Thank you for upgrading to Pro! We're excited to help you manage your construction projects more efficiently.</p>
          </div>
          <div class="footer">
            <p>BuildStack Pro - Construction Management Platform</p>
            <p>If you have any questions, contact our support team.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
      Payment Successful - Welcome to BuildStack Pro!
      
      Congratulations ${userName}! Your payment of ${amount} has been processed successfully.
      
      You now have access to unlimited construction projects and advanced features.
      
      Access your Pro features: ${process.env.NEXT_PUBLIC_BASE_URL}/dashboard
      
      BuildStack Pro - Construction Management Platform
    `
  })
};

// Send email function
export const sendEmail = async (to: string, template: keyof typeof emailTemplates, data: any) => {
  try {
    // Check if email credentials are configured
    if (!process.env.EMAIL_SERVER_USER && !process.env.EMAIL_USER) {
      console.log('📧 Email credentials not configured. Skipping email send.');
      console.log('📧 Would have sent email to:', to);
      if (template === 'projectInvitation') {
        console.log('📧 Subject:', emailTemplates[template](data.projectName, data.inviteLink, data.invitedBy).subject);
      }
      return { success: true, messageId: 'email-skipped-no-credentials' };
    }

    const emailTemplate = emailTemplates[template];
    let emailContent;
    
    // Handle different template types
    if (template === 'projectInvitation') {
      emailContent = emailTemplate(data.projectName, data.inviteLink, data.invitedBy);
    } else if (template === 'welcomeEmail') {
      emailContent = (emailTemplate as (a: string, b: string) => any)(data.userName, data.companyName);
    } else if (template === 'paymentSuccess') {
      emailContent = (emailTemplate as (a: string, b: string) => any)(data.userName, data.amount);
    } else {
      throw new Error(`Unknown template: ${template}`);
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_SERVER_USER || process.env.EMAIL_USER,
      to: to,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text,
    };

    console.log('📧 Attempting to send email to:', to);
    console.log('📧 Email subject:', emailContent.subject);
    console.log('📧 From email:', mailOptions.from);
    
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    // Don't throw error, just log it so the invitation still works
    return { success: false, error: error.message };
  }
};

// Verify transporter
export const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('Nodemailer transporter is ready');
    return true;
  } catch (error) {
    console.error('Nodemailer transporter verification failed:', error);
    return false;
  }
};

export default transporter; 