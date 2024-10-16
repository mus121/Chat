import { NextResponse } from 'next/server';

export async function POST() {
  try {
    return NextResponse.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Error during logout:', error);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}
