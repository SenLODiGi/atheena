import { NextResponse } from "next/server";
import { AccessToken } from "livekit-server-sdk";

type TokenRequest = {
  roomName?: string;
  participantName?: string;
};

export async function POST(request: Request) {
  try {
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json(
        {
          error:
            "Missing LIVEKIT_API_KEY, LIVEKIT_API_SECRET, or NEXT_PUBLIC_LIVEKIT_URL.",
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as TokenRequest;
    const roomName = body.roomName ?? "atheena-oracle-sanctum";
    const participantName =
      body.participantName ?? `seeker-${crypto.randomUUID().slice(0, 8)}`;

    const token = new AccessToken(apiKey, apiSecret, {
      identity: participantName,
      name: participantName,
      ttl: "10m",
    });

    token.addGrant({
      roomJoin: true,
      room: roomName,
      canPublish: true,
      canSubscribe: true,
      canPublishData: true,
    });

    return NextResponse.json({ token: await token.toJwt(), url: wsUrl });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Token generation failed",
      },
      { status: 500 }
    );
  }
}
