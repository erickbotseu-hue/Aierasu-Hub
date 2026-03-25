
export function middleware(request) {
  const url = new URL(request.url);
  const { pathname } = url;
  
  // Skip if already in /es/ or if it's a file with extension (css, js, png, etc.)
  if (pathname.startsWith('/es/') || pathname.includes('.')) {
    return;
  }
  
  const acceptLanguage = request.headers.get('accept-language') || '';
  
  if (acceptLanguage.toLowerCase().includes('es')) {
    // Redirect to the Spanish version
    return Response.redirect(new URL(`/es${pathname}`, request.url), 302);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
