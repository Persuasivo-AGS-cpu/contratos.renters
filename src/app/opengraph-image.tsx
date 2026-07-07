import { ImageResponse } from 'next/og';

export const alt = 'Renters — Contratos de Arrendamiento Legales por Estado';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'linear-gradient(135deg, #0a0f1c 0%, #111827 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
          <div
            style={{
              width: 56,
              height: 56,
              background: '#4D6BFE',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 34,
              fontWeight: 800,
              color: '#fff',
            }}
          >
            R
          </div>
          <span style={{ fontSize: 40, fontWeight: 800 }}>Renters</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', fontSize: 68, fontWeight: 900, lineHeight: 1.1, letterSpacing: -2 }}>
          <span>Contratos de arrendamiento</span>
          <span style={{ color: '#4D6BFE' }}>legalmente válidos en minutos</span>
        </div>

        <div style={{ display: 'flex', gap: 40, marginTop: 56, fontSize: 28, color: '#9ca3af', fontWeight: 600 }}>
          <span style={{ display: 'flex' }}>✓ Redactado por abogados</span>
          <span style={{ display: 'flex' }}>✓ $499 MXN</span>
          <span style={{ display: 'flex' }}>✓ 5 estados</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
