import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const token = request.cookies.get('auth_token')?.value || '';
  const session = token ? await verifySession(token) : null;
  const role = session?.role || '';

  // 1. Protect Admin Routes
  if (path.startsWith('/admin') && path !== '/admin/login') {
    if (!session || role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.nextUrl));
    }
  }

  // 2. Protect Staff Routes
  if (path.startsWith('/staff') && path !== '/staff/login') {
    if (!session || role !== 'scanner_staff') {
      return NextResponse.redirect(new URL('/staff/login', request.nextUrl));
    }
  }

  // 3. Protect Organizer Routes
  if (path.startsWith('/organizer') && path !== '/organizer/login') {
    if (!session || role !== 'organizer') {
      return NextResponse.redirect(new URL('/organizer/login', request.nextUrl));
    }
  }

  // 4. Prevent logged-in users from seeing login pages
  if (path === '/admin/login' && session && role === 'admin') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.nextUrl));
  }
  if (path === '/staff/login' && session && role === 'scanner_staff') {
    return NextResponse.redirect(new URL('/staff/scanner', request.nextUrl));
  }
  if (path === '/organizer/login' && session && role === 'organizer') {
    return NextResponse.redirect(new URL('/organizer/dashboard', request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/staff/:path*',
    '/organizer/:path*'
  ]
};
