import { cookies } from "next/headers";

const SESSION_COOKIE = "gem_session_id";

export async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;

  // Cookie is always set by middleware, but fallback just in case
  return sessionId || "anonymous";
}
