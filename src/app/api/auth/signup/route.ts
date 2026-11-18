import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { generateToken } from '@/lib/jwt';
import { USER_ROLES } from '@/lib/constants';

const signupSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100),
  email: z.string().trim().toLowerCase().email('Invalid email').max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(200),
  role: z.enum([USER_ROLES.VETERINARIAN, USER_ROLES.PET_OWNER], {
    errorMap: () => ({ message: 'Invalid role' }),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { message: parsed.error.issues[0]?.message ?? 'Missing required fields' },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;
    const passwordHash = await bcryptjs.hash(password, 10);

    let user;
    try {
      user = await prisma.user.create({
        data: { name, email, password: passwordHash, role },
        select: { id: true, email: true, name: true, role: true },
      });
    } catch (error: any) {
      // P2002: unique constraint on users.email
      if (error?.code === 'P2002') {
        return NextResponse.json({ message: 'User already exists' }, { status: 409 });
      }
      throw error;
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user,
        token,
      },
      { status: 201 }
    );

    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
