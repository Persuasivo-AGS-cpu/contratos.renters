import { ImageResponse } from 'next/og';

// Favicon de la pestaña del panel admin.
export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

export default function AdminIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0f172a',
          borderRadius: 12,
        }}
      >
        <div style={{ fontSize: 40, fontWeight: 800, color: '#4D6BFE' }}>R</div>
      </div>
    ),
    { ...size }
  );
}
