import bcryptjs from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/app/api/auth/mock-users';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (findUserByEmail(email)) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 409 }
      );
    }

    const passwordHash = await bcryptjs.hash(password, 10);
    const userId = `user_${Date.now()}`;

    const newUser = createUser({
      id: userId,
      email,
      name,
      passwordHash,
      role,
    });

    const token = generateToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    const response = NextResponse.json(
      {
        message: 'User created successfully',
        user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
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
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
