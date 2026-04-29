'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@repo/db';
import { stripe } from '@/lib/stripe'; // Assuming this exists or I'll create it
import { redirect } from 'next/navigation';

/**
 * Create a Stripe Express account for a lender and generate an onboarding link.
 */
export async function onboardLender() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user) throw new Error('User not found');

  let stripeAccountId = user.stripeAccountId;

  // 1. Create a Stripe account if they don't have one
  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: 'express',
      email: user.email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: { userId: user.id },
    });

    stripeAccountId = account.id;

    await prisma.user.update({
      where: { id: user.id },
      data: { stripeAccountId: stripeAccountId }
    });
  }

  // 2. Create an account link for onboarding
  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${process.env.NEXTAUTH_URL}/lender/settings?error=onboarding_failed`,
    return_url: `${process.env.NEXTAUTH_URL}/lender/settings?success=onboarding_complete`,
    type: 'account_onboarding',
  });

  return { url: accountLink.url };
}

/**
 * Generate a link to the Stripe Express Dashboard for lenders to see their earnings.
 */
export async function getStripeDashboardLink() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id }
  });

  if (!user || !user.stripeAccountId) throw new Error('Stripe account not found');

  const loginLink = await stripe.accounts.createLoginLink(user.stripeAccountId);
  return { url: loginLink.url };
}
