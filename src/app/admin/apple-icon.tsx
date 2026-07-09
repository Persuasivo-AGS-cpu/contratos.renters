import { ImageResponse } from 'next/og';

// Icono para "Añadir a inicio" en iOS — identidad propia del panel admin
// (fondo oscuro "modo HQ") distinta del sitio público.
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AdminAppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        }}
      >
        <div
          style={{
            width: 96,
            height: 96,
            background: '#4D6BFE',
            borderRadius: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 60,
            fontWeight: 800,
            color: '#fff',
          }}
        >
          R
        </div>
        <div style={{ marginTop: 14, fontSize: 22, fontWeight: 700, color: '#94a3b8', letterSpacing: 2 }}>
          HQ
        </div>
      </div>
    ),
    { ...size }
  );
}
