# Atheena Oracle Voice UI

Cinematic Next.js 15 frontend for **Atheena** (always spelled with two e's), a real-time LiveKit voice oracle experience with Greek mythological + futuristic AI aesthetics.

## Stack

- Next.js 15 (App Router, TypeScript)
- Tailwind CSS
- GSAP + @gsap/react
- @livekit/components-react + livekit-client

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Copy env file and set values:

```bash
cp .env.example .env.local
```

3. Start dev server:

```bash
npm run dev
```

## Required Environment Variables

Public:

- `NEXT_PUBLIC_LIVEKIT_URL` = your LiveKit Cloud websocket URL (`wss://...`)
- `NEXT_PUBLIC_LIVEKIT_ROOM` = room name (default `atheena-oracle-sanctum`)
- `NEXT_PUBLIC_LIVEKIT_TOKEN_ENDPOINT` = token API endpoint (default `/api/livekit/token`)

Server-only (for token minting route):

- `LIVEKIT_API_KEY`
- `LIVEKIT_API_SECRET`

Optional:

- `NEXT_PUBLIC_LIVEKIT_TOKEN` (static token for quick testing only)

## Vercel Deployment

1. Import the project in Vercel.
2. Add all env vars above in Project Settings -> Environment Variables.
3. Deploy.
4. Ensure your LiveKit agent joins the same room (`NEXT_PUBLIC_LIVEKIT_ROOM`) and is reachable.

## Notes

- The story mode transitions to the active call screen with GSAP cinematic animations.
- The call screen includes Atheena avatar speaking animation, waveform, and a live transcript panel.
- For production voice quality, run a dedicated LiveKit agent service (Python or Node) that joins as an assistant identity containing `atheena`.
