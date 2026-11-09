'use client';
import { useEffect, useState } from 'react';

export default function ProfilePage() {
  const [data, setData] = useState<any>(null);
  const userId = 1;

  useEffect(() => {
    fetch(`/api/profile/${userId}`)
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p>Memuat profil...</p>;
  if (data.error) return <p>Error: {data.error}</p>;

  const { user, history } = data;
  return (
    <div>
      <h1>Profil — {user.username}</h1>
      <div className="card">
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Level:</strong> {user.level}</p>
        <p><strong>XP:</strong> {user.xp}</p>
        <p><strong>Koin:</strong> {user.coins}</p>
      </div>

      <h2>Riwayat Simulasi</h2>
      {history.length === 0 && <p>Belum ada riwayat.</p>}
      {history.map((h: any) => (
        <div key={h.id} className="card">
          <strong>{h.title}</strong> ({h.category}/{h.difficulty})
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            Skor {h.score} • +{h.xp_gained} XP • +{h.coins_gained} koin •{' '}
            {new Date(h.submitted_at).toLocaleString('id-ID')}
          </p>
        </div>
      ))}
    </div>
  );
}