"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
} from "@livekit/components-react";
import {
  ParticipantEvent,
  Room,
  RoomEvent,
  type RemoteParticipant,
} from "livekit-client";
import { Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { AtheenaAvatar } from "@/components/AtheenaAvatar";
import { useLiveKitConnection } from "@/hooks/useLiveKitConnection";

// useGSAP is a React hook for integrating GSAP timelines in components.

type TranscriptEntry = {
  id: string;
  text: string;
  timestamp: number;
  final: boolean;
};

type TranscriptSegment = {
  id?: string;
  text: string;
  firstReceivedTime: number;
  final: boolean;
};

type CallViewProps = {
  onEnd: () => void;
};

const loadingMessages: Record<string, string> = {
  "sandbox-creating": "Sandbox Creating...",
  connecting: "Connecting to Atheena...",
};

export function CallView({ onEnd }: CallViewProps) {
  const {
    phase,
    token,
    serverUrl,
    error,
    connect,
    disconnect,
  } = useLiveKitConnection();

  const [room, setRoom] = useState<Room | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(true);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const panelRef = useRef<HTMLDivElement>(null);
  const waveformBarsRef = useRef<HTMLDivElement>(null);
  const waveTweensRef = useRef<any[]>([]);

  useEffect(() => {
    void connect();
  }, [connect]);

  useGSAP(
    () => {
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      );
    },
    { scope: panelRef }
  );

  useEffect(() => {
    const bars = waveformBarsRef.current?.querySelectorAll("span") as
      | NodeListOf<HTMLSpanElement>
      | undefined;
    if (!bars || bars.length === 0) {
      return;
    }

    waveTweensRef.current?.forEach((tween: any) => tween.kill());
    waveTweensRef.current = [];

    bars.forEach((bar: HTMLSpanElement, index: number) => {
      const tween = gsap.to(bar as any, {
        height: isAgentSpeaking ? `${26 + (index % 5) * 8}px` : `${8 + (index % 3) * 3}px`,
        duration: 0.28 + (index % 4) * 0.04,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: index * 0.02,
      });
      waveTweensRef.current?.push(tween);
    });

    return () => {
      waveTweensRef.current?.forEach((tween: any) => tween.kill());
      waveTweensRef.current = [];
    };
  }, [isAgentSpeaking]);

  const loadingLabel = useMemo(() => loadingMessages[phase], [phase]);

  const appendTranscriptions = (segments: TranscriptSegment[]) => {
    setTranscript((prev) => {
      const next = [...prev];

      segments.forEach((segment: TranscriptSegment) => {
        const id = segment.id ?? `${segment.firstReceivedTime}-${segment.text}`;
        const foundIndex = next.findIndex((entry) => entry.id === id);

        const entry: TranscriptEntry = {
          id,
          text: segment.text,
          timestamp: segment.firstReceivedTime,
          final: segment.final,
        };

        if (foundIndex === -1) {
          next.push(entry);
        } else {
          next[foundIndex] = entry;
        }
      });

      return next.slice(-60);
    });
  };

  const onConnected = (connectedRoom: Room) => {
    setRoom(connectedRoom);

    connectedRoom.on(RoomEvent.TranscriptionReceived, appendTranscriptions);

    const syncSpeaking = (participant?: RemoteParticipant) => {
      if (!participant) {
        return;
      }
      if (participant.identity.toLowerCase().includes("atheena")) {
        setIsAgentSpeaking(participant.isSpeaking);
      }
    };

    connectedRoom.remoteParticipants.forEach((participant: RemoteParticipant) => {
      syncSpeaking(participant);
      participant.on(ParticipantEvent.IsSpeakingChanged, () =>
        syncSpeaking(participant)
      );
    });

    connectedRoom.on(RoomEvent.ParticipantConnected, (participant: any) => {
      syncSpeaking(participant as RemoteParticipant);
      participant.on(ParticipantEvent.IsSpeakingChanged, () =>
        syncSpeaking(participant as RemoteParticipant)
      );
    });

    connectedRoom.on(RoomEvent.Disconnected, () => {
      setRoom(null);
      setIsAgentSpeaking(false);
    });
  };

  const toggleMic = async () => {
    if (!room) {
      return;
    }

    const nextState = !isMuted;
    await room.localParticipant.setMicrophoneEnabled(!nextState);
    setIsMuted(nextState);
  };

  const toggleSpeaker = () => {
    const nextState = !speakerOn;
    setSpeakerOn(nextState);

    document.querySelectorAll("audio").forEach((element) => {
      element.muted = !nextState;
    });
  };

  const endCall = () => {
    room?.disconnect();
    disconnect();
    onEnd();
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-marble-night px-4 py-6 text-white md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-parthenon-lines opacity-15" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(125,249,255,0.1),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(140,109,255,0.2),transparent_30%)]" />

      {loadingLabel && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm">
          <div className="gold-filigree rounded-2xl border border-imperialGold-300/80 bg-slate-950/75 px-8 py-6 text-center shadow-oracle-glow">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-imperialGold-200 border-t-transparent" />
            <p className="font-display text-2xl text-imperialGold-200">{loadingLabel}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="absolute right-4 top-4 z-40 rounded-xl border border-rose-300/60 bg-rose-950/70 px-4 py-2 text-sm text-rose-100">
          {error}
        </div>
      )}

      <div ref={panelRef} className="relative z-10 mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <AtheenaAvatar speaking={isAgentSpeaking} connected={phase === "connected"} />

          <div className="gold-filigree greek-key-border rounded-2xl bg-slate-900/65 p-4 md:p-5">
            <p className="mb-3 font-tech text-xs tracking-[0.2em] text-imperialGold-200">
              VOICE CURRENT OF OLYMPUS
            </p>
            <div
              ref={waveformBarsRef}
              className="flex h-16 items-end gap-1 rounded-xl border border-imperialGold-200/25 bg-slate-950/50 px-3 py-2"
            >
              {Array.from({ length: 36 }).map((_, index) => (
                <span
                  key={index}
                  className="w-[6px] rounded-full bg-gradient-to-t from-imperialGold-500/70 via-ethereal/70 to-nebula-500/70"
                  style={{ height: "10px" }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pb-2">
            <button
              type="button"
              onClick={toggleMic}
              className="inline-flex items-center gap-2 rounded-full border border-imperialGold-300/70 bg-slate-900/70 px-5 py-2.5 font-tech text-xs tracking-[0.15em] text-imperialGold-100 transition hover:scale-[1.02]"
            >
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              {isMuted ? "UNMUTE" : "MUTE"}
            </button>

            <button
              type="button"
              onClick={toggleSpeaker}
              className="inline-flex items-center gap-2 rounded-full border border-imperialGold-300/70 bg-slate-900/70 px-5 py-2.5 font-tech text-xs tracking-[0.15em] text-imperialGold-100 transition hover:scale-[1.02]"
            >
              {speakerOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
              {speakerOn ? "SPEAKER ON" : "SPEAKER OFF"}
            </button>

            <button
              type="button"
              onClick={endCall}
              className="inline-flex items-center gap-2 rounded-full border border-rose-300/70 bg-rose-900/60 px-5 py-2.5 font-tech text-xs tracking-[0.15em] text-rose-100 transition hover:scale-[1.02]"
            >
              <PhoneOff size={16} />
              END CALL
            </button>
          </div>
        </div>

        <aside className="scroll-panel greek-key-border gold-filigree rounded-2xl p-4 md:p-5">
          <p className="mb-4 font-display text-2xl text-imperialGold-100">Sacred Transcript</p>
          <div className="max-h-[62vh] space-y-2 overflow-y-auto pr-1">
            {transcript.length === 0 && (
              <p className="font-body text-lg text-slate-300/80">
                The scroll awaits the first divine exchange...
              </p>
            )}

            {transcript.map((line: TranscriptEntry) => (
              <div
                key={line.id}
                className="rounded-xl border border-imperialGold-200/25 bg-slate-950/40 p-3"
              >
                <p className="font-body text-lg leading-relaxed text-slate-100">{line.text}</p>
                <p className="mt-1 font-tech text-[10px] tracking-[0.15em] text-slate-400">
                  {new Date(line.timestamp).toLocaleTimeString()} · {line.final ? "FINAL" : "LIVE"}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {token && serverUrl && (
        <LiveKitRoom
          token={token}
          serverUrl={serverUrl}
          connect={phase === "connected"}
          audio
          video={false}
          onConnected={onConnected}
          onDisconnected={() => {
            setRoom(null);
            setIsAgentSpeaking(false);
          }}
          className="hidden"
        >
          <RoomAudioRenderer />
          <StartAudio label="Enable audio" />
        </LiveKitRoom>
      )}
    </section>
  );
}
