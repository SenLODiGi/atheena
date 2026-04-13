"use client";

import { useCallback, useMemo, useState } from "react";

export type ConnectionPhase =
  | "idle"
  | "sandbox-creating"
  | "connecting"
  | "connected"
  | "error";

type TokenResponse = {
  token: string;
  url?: string;
};

type UseLiveKitConnectionReturn = {
  phase: ConnectionPhase;
  roomName: string;
  serverUrl: string;
  token: string;
  error: string | null;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const DEFAULT_ROOM = "atheena-oracle-sanctum";

export function useLiveKitConnection(): UseLiveKitConnectionReturn {
  const [phase, setPhase] = useState<ConnectionPhase>("idle");
  const [token, setToken] = useState("");
  const [serverUrl, setServerUrl] = useState(
    process.env.NEXT_PUBLIC_LIVEKIT_URL ?? ""
  );
  const [error, setError] = useState<string | null>(null);

  const roomName = useMemo(
    () => process.env.NEXT_PUBLIC_LIVEKIT_ROOM ?? DEFAULT_ROOM,
    []
  );

  const connect = useCallback(async () => {
    try {
      setError(null);
      setPhase("sandbox-creating");

      await new Promise((resolve) => setTimeout(resolve, 900));

      setPhase("connecting");

      const staticToken = process.env.NEXT_PUBLIC_LIVEKIT_TOKEN;
      if (staticToken) {
        setToken(staticToken);
        setPhase("connected");
        return;
      }

      const endpoint =
        process.env.NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT ?? "/api/livekit/token";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomName,
          participantName: `seeker-${crypto.randomUUID().slice(0, 8)}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Could not retrieve LiveKit token.");
      }

      const data = (await response.json()) as TokenResponse;
      if (!data.token) {
        throw new Error("Token endpoint returned an invalid payload.");
      }

      if (data.url) {
        setServerUrl(data.url);
      }

      setToken(data.token);
      setPhase("connected");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Connection failed";
      setError(message);
      setPhase("error");
    }
  }, [roomName]);

  const disconnect = useCallback(() => {
    setPhase("idle");
    setToken("");
    setError(null);
  }, []);

  return {
    phase,
    roomName,
    serverUrl,
    token,
    error,
    connect,
    disconnect,
  };
}
