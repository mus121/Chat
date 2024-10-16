import { NextResponse } from 'next/server';
import { cook } from '../../actions'; 

export async function POST(req: Request) {
  try {
    const formData = await req.json();
    const response = await fetch('http://localhost:5001/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      return NextResponse.json({ message: 'Signup failed' }, { status: 400 });
    }

    const { authToken, user } = await response.json();
    console.log("Auth Token", authToken);
    await cook();

    return NextResponse.json({ user, authToken });
  } catch (error) {
    console.error('Error during signup:', error);
    return NextResponse.json({ message: 'Signup failed' }, { status: 500 });
  }
}
