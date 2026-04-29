'use server';

import { z } from 'zod';
import { prisma } from '@repo/db';
import * as bcrypt from 'bcryptjs';
import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';
import { sendWelcomeEmail } from '@/lib/mail';

const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function registerUser(prevState: any, formData: FormData) {
  const validatedFields = registerSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { firstName, lastName, email, password } = validatedFields.data;
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return {
        message: 'A user with this email already exists.',
      };
    }

    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role: 'RENTER',
        status: 'ACTIVE',
      },
    });

    // Send welcome email (async, don't wait for it)
    sendWelcomeEmail(email, firstName).catch(console.error);

    return { success: true };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      message: 'Something went wrong. Please try again.',
    };
  }
}

export async function loginUser(prevState: string | undefined, formData: FormData) {
  try {
    await signIn('credentials', formData);
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'Invalid credentials.';
        default:
          return 'Something went wrong.';
      }
    }
    throw error;
  }
}
