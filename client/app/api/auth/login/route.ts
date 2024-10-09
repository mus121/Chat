import { NextResponse } from 'next/server';
import { loginUser } from '../../../utils/auth'; 

export async function POST(req: Request) {
    const { username, password } = await req.json();

    const user = await loginUser(username, password);
    if (user) {
        // Create and return JWT token
        const token = user.token; 
        return NextResponse.json({ token });
    } else {
        return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
}
