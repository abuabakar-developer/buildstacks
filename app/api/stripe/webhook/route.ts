import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { headers } from 'next/headers';
import { sendEmail } from '@/utils/nodemailer';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const signature = headersList.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment successful for session:', session.id);
        
        // Send payment success email
        if (session.customer_email) {
          try {
            await sendEmail(session.customer_email, 'paymentSuccess', {
              userName: session.customer_details?.name || 'Valued Customer',
              amount: `$${(session.amount_total || 0) / 100}`
            });
            console.log('Payment success email sent to:', session.customer_email);
          } catch (error) {
            console.error('Failed to send payment success email:', error);
          }
        }
        
        // Here you would typically:
        // 1. Update user's subscription status in your database
        // 2. Update user's plan limits
        
        // Example: Update user subscription in database
        if (session.metadata?.userId) {
          try {
            // Update user subscription status
            // await updateUserSubscription(session.metadata.userId, 'pro');
            console.log('User subscription updated:', session.metadata.userId);
          } catch (error) {
            console.error('Failed to update user subscription:', error);
          }
        }
        break;

      case 'customer.subscription.created':
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Subscription created:', subscription.id);
        break;

      case 'customer.subscription.updated':
        const updatedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription updated:', updatedSubscription.id);
        break;

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription;
        console.log('Subscription deleted:', deletedSubscription.id);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' }, 
      { status: 500 }
    );
  }
} 