import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('token');

    if (!token) {
        return NextResponse.redirect('/'); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/dashboard/:path*'], 
};
