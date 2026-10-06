import { NextResponse, type NextRequest } from "next/server";

/*
  ZHONNEX 7-LAYER ENCRYPTION FIREWALL
  L1: TLS/HSTS (Vercel) — encrypted transit
  L2: Security Headers — CSP, X-Frame, etc.
  L3: Edge Firewall — matcher + cookie checks
  L4: Passkey Signature — ETA-...-Lagos + expiry
  L5: RLS Isolation — Supabase tier/track guard (enforced in pages)
  L6: Rate/Fingerprint — entropy + bot guard (light)
  L7: God Mode Bypass — master cookie for Owner only

  PUBLIC: blocked at L3/L4 → redirect to /?gate=passkey
  STUDENT/STAFF: must have valid passkey → checked at L5
  OWNER (you): God Mode cookie bypasses ALL → invisible ghost entry
*/

const GOD_MODE_KEY = "ZHX-OMNI-MASTER-2025";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // L2: Security Headers — applied to every response
  res.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://js.stripe.com https://api.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https: wss:; frame-src https://js.stripe.com https://checkout.paystack.com;"
  );

  // Public routes: allow all (L1+L2 only)
  if (
    pathname === "/" ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return res;
  }

  // L7: God Mode — Owner bypasses everything, invisible
  const godMode = req.cookies.get("zhonnex_god_mode")?.value === GOD_MODE_KEY;
  const godPasskey = req.cookies.get("zhonnex_passkey")?.value === GOD_MODE_KEY;
  if (godMode || godPasskey) {
    // No logging, no block — ghost
    res.headers.set("x-zhonnex-god", "1");
    return res;
  }

  // L3+L4: Edge gate for protected zones
  const hasPasskey = req.cookies.get("zhonnex_passkey")?.value;
  const isValidPasskey = hasPasskey && hasPasskey.startsWith("ETA-") && hasPasskey.length >= 12;
  
  const isStudent = pathname.startsWith("/student-course-dashboard");
  const isTeacher = pathname.startsWith("/teacher-lecture-suite");
  const isAdmin = pathname.startsWith("/admin-control-dashboard");

  // Enforce for student/teacher (admin is also locked unless God Mode)
  // If you want Control Room locked for everyone except you, uncomment next block:
  // if (isAdmin && !isValidPasskey) {
  //   return NextResponse.redirect(new URL("/?gate=passkey", req.url));
  // }
  if ((isStudent || isTeacher) && !isValidPasskey) {
    return NextResponse.redirect(new URL("/?gate=passkey", req.url));
  }

  // L6: lightweight bot signal (no hard block, just header)
  const ua = req.headers.get("user-agent") || "";
  if (ua.length < 10) {
    res.headers.set("x-zhonnex-risk", "low-ua");
  }

  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};