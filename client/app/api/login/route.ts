import { NextResponse } from 'next/server';
import { cook } from '../../actions'; 

export async function POST(request: Request) {
  try {
    const loginData = await request.json();
    const response = await fetch('http://localhost:5001/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(loginData),
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Login failed' }, { status: 400 });
    }

    const { authToken, user } = await response.json();
   
    await cook(); 
    return NextResponse.json({ user, authToken });
  } catch (error) {
    console.error('Error during login:', error);
    return NextResponse.json({ message: 'Login failed' }, { status: 500 });
  }
}
