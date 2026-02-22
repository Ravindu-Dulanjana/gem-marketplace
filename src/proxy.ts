import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protect seller dashboard routes
  if (request.nextUrl.pathname.startsWith("/seller/dashboard")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/seller/login";
      return NextResponse.redirect(url);
    }
  }

  // Protect admin routes (role check happens in admin layout)
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/seller/login";
      return NextResponse.redirect(url);
    }
  }

  // Ensure session ID cookie exists for guest features (wishlist, recently viewed)
  const SESSION_COOKIE = "gem_session_id";
  if (!request.cookies.get(SESSION_COOKIE)) {
    const sessionId = crypto.randomUUID();
    supabaseResponse.cookies.set(SESSION_COOKIE, sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }

  // Redirect logged-in sellers away from login/register
  if (
    user &&
    (request.nextUrl.pathname === "/seller/login" ||
      request.nextUrl.pathname === "/seller/register")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/seller/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
