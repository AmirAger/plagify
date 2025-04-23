import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Create a new user in Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create user',
        error: error.message
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      userId: data.user?.id
    });
  } catch (error: any) {
    console.error('User creation error:', error);
    return NextResponse.json({
      success: false,
      message: 'User creation failed',
      error: error.message
    }, { status: 500 });
  }
}