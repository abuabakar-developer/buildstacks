import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const { email, userId, companyId } = await req.json();

    // Create or retrieve customer
    let customer;
    const customerEmail = email || 'guest@construction-saas.com';
    
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          userId: userId || 'guest',
          companyId: companyId || 'guest-company',
        },
      });
    }

    // Create checkout session with construction SaaS branding
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      mode: 'payment', // One-time payment instead of subscription
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'BuildStack Pro - Construction Management',
              description: 'Unlimited projects, advanced analytics, priority support, and document management for construction companies.',
              images: ['https://your-domain.com/buildstack-logo.png'], // Optional: Add your logo
            },
            unit_amount: 9900, // $99.00 in cents
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId: userId || 'guest',
        companyId: companyId || 'guest-company',
      },
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?upgrade=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/dashboard?upgrade=cancel`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_update: {
        address: 'auto',
        name: 'auto',
      },
      // Custom branding for construction SaaS
      custom_text: {
        submit: {
          message: "Complete your Pro upgrade to unlock unlimited construction projects, advanced analytics, and priority support.",
        },
      },
      // Professional construction SaaS description
      custom_fields: [
        {
          key: 'company_name',
          label: {
            type: 'custom',
            custom: 'Company Name',
          },
          type: 'text',
          optional: true,
        },
        {
          key: 'construction_type',
          label: {
            type: 'custom',
            custom: 'Primary Construction Type',
          },
          type: 'dropdown',
          dropdown: {
            options: [
              { label: 'Residential', value: 'residential' },
              { label: 'Commercial', value: 'commercial' },
              { label: 'Industrial', value: 'industrial' },
              { label: 'Infrastructure', value: 'infrastructure' },
              { label: 'Mixed', value: 'mixed' },
            ],
          },
          optional: true,
        },
      ],
    });

    return NextResponse.json({ 
      url: session.url,
      sessionId: session.id 
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' }, 
      { status: 500 }
    );
  }
} 