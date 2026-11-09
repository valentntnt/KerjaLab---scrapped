import type { Metadata } from 'next';
// @ts-ignore - Next.js provides the global CSS typing during build/runtime.
import './globals.css';

export const metadata: Metadata = {
  title: 'KerjaLab',
  description: 'Simulasi Pekerjaan Berbasis Cloud',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <nav style={{ padding: '1rem 2rem', borderBottom: '1px solid #ddd', display: 'flex', gap: '1rem' }}>
          <a href="/"><strong>KerjaLab</strong></a>
          <a href="/profile">Profil</a>
        </nav>
        <main style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>{children}</main>
      </body>
    </html>
  );
}