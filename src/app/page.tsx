import {
  FRAME_METADATA,
  SITE_URL,
} from '@/config';
import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: SITE_URL ? new URL(SITE_URL) : undefined,
  title: 'Shark Mafia',
  other: FRAME_METADATA,
};

export default function Home() {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex' }}>
      <h1
        style={{
          margin: 'auto',
          fontFamily: 'Comic Sans MS, Comic Sans, cursive',
        }}
      >
        <a
          href={`https://warpcast.com/~/channel/sharks`}
          style={{ color: 'inherit' }}
        >
          🦈Shark mafia🦈
        </a>
      </h1>
    </div>
  );
}
