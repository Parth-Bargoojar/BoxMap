import { ImageResponse } from 'next/og'

export const alt = 'BoxMap — Know what\'s where.'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#4F46E5',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          color: '#FFFFFF',
          padding: '80px',
        }}
      >
        {/* Simple geometric icon */}
        <div
          style={{
            display: 'flex',
            marginBottom: '40px',
            border: '8px solid #FFFFFF',
            borderRadius: '24px',
            padding: '24px',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#FFFFFF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          style={{
            fontSize: '84px',
            fontWeight: 'bold',
            margin: '0',
            letterSpacing: '-0.03em',
          }}
        >
          BoxMap
        </h1>

        {/* Tagline */}
        <p
          style={{
            fontSize: '32px',
            color: '#E0E7FF',
            margin: '20px 0 0 0',
            fontWeight: '500',
          }}
        >
          Know what&apos;s where.
        </p>
      </div>
    ),
    {
      ...size,
    }
  )
}
