import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const PUBLIC_ROUTES = ['/login', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const isPublicRoute = PUBLIC_ROUTES.some(route =>
    pathname.startsWith(route)
  )

  // Se as env vars do Supabase não estiverem configuradas, deixa passar sem auth
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return NextResponse.next()
  }

  try {
    const { supabaseResponse, user } = await updateSession(request)

    // Sem sessão em rota protegida → login
    if (!user && !isPublicRoute) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('redirectTo', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Com sessão em rota pública → dashboard
    if (user && isPublicRoute) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return supabaseResponse
  } catch {
    // Em caso de erro do Supabase, redireciona para login se rota protegida
    if (!isPublicRoute) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
