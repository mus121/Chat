import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const token = req.cookies.get('authToken');
    if (!token) {
        return NextResponse.redirect('/'); 
    }

    return NextResponse.next(); 
}

export const config = {
    matcher: ['/'], 
};
