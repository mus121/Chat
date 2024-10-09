import { NextResponse } from 'next/server';
import { registerUser } from '../../../utils/auth'; 

export async function POST(req: Request) {
    const { email, displayName, username, password } = await req.json();

    const user = await registerUser({ email, displayName, username, password });
    if (user) {
        return NextResponse.json({ message: 'Signup successful!' });
    } else {
        return NextResponse.json({ message: 'Signup failed' }, { status: 400 });
    }
}
