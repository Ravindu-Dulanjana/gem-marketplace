"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface TrackViewProps {
  gemId: string;
  sessionId: string;
}

export default function TrackView({ gemId, sessionId }: TrackViewProps) {
  useEffect(() => {
    async function track() {
      const supabase = createClient();
      await supabase
        .from("recently_viewed")
        .upsert(
          {
            session_id: sessionId,
            gem_id: gemId,
            viewed_at: new Date().toISOString(),
          },
          { onConflict: "session_id,gem_id" }
        );
    }

    track();
  }, [gemId, sessionId]);

  return null;
}
