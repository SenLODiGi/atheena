declare module 'gsap';
declare module '@gsap/react' {
  // simplified hook signature used in components: useGSAP(fn, options?)
  export function useGSAP(fn: () => void, options?: any): void;
  const _default: any;
  export default _default;
}

declare module 'next' {
  export type Metadata = any;
}

declare module 'next/font/google' {
  export const Cinzel: any;
  export const Cormorant_Garamond: any;
  export const Orbitron: any;
  const _default: any;
  export default _default;
}

declare module '@livekit/components-styles';
declare module '@livekit/components-react';
declare module 'lucide-react';
declare module 'gsap/ScrollTrigger';

declare module 'livekit-client' {
  export type Room = any;
  export type RemoteParticipant = any;
  export const RoomEvent: any;
  export const ParticipantEvent: any;
}

declare module 'react' {
  export type DependencyList = any[];
  export type ReactNode = any;
  export function useState<T = any>(initial?: T | (() => T)): [T, (v: T | ((prev: T) => T)) => void];
  export function useRef<T = any>(initial: T | null): { current: T | null };
  export function useEffect(fn: () => void | (() => void), deps?: DependencyList): void;
  export function useMemo<T>(fn: () => T, deps?: DependencyList): T;
  export function useCallback<T extends (...args: any[]) => any>(fn: T, deps?: DependencyList): T;
  export default any;
}

declare const process: {
  env: { [key: string]: string | undefined };
};

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
