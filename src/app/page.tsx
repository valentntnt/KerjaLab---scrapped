'use client';
import { useEffect, useState } from 'react';

type Simulation = {
  id: number;
  title: string;
  category: string;
  difficulty: string;
  description: string;
  reward_xp: number;
  reward_coins: number;
};

export default function Home() {
  const [sims, setSims] = useState<Simulation[]>([]);
  const [answer, setAnswer] = useState<Record<number, string>>({});
  const [msg, setMsg] = useState('');
  const [userId] = useState(1); // demo: user id 1 = valent

  useEffect(() => {
    fetch('/api/simulations')
      .then((r) => r.json())
      .then((d) => setSims(d.data));
  }, []);

  async function submit(simId: number) {
    setMsg('');
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, simulationId: simId, answer: answer[simId] || '' }),
    });
    const data = await res.json();
    if (res.ok) {
      setMsg(`✅ Berhasil! XP +${data.submission.xp_gained}, Koin +${data.submission.coins_gained}`);
      setAnswer({ ...answer, [simId]: '' });
    } else {
      setMsg(`❌ ${data.error}`);
    }
  }

  return (
    <div>
      <h1>Simulasi Kerja</h1>
      <p>Pilih simulasi, kerjakan, dan kumpulkan untuk mendapat XP & koin.</p>
      {msg && <p style={{ padding: '0.5rem', background: '#f0f9ff', borderRadius: 6 }}>{msg}</p>}
      {sims.map((s) => (
        <div key={s.id} className="card">
          <h3>{s.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#666' }}>
            {s.category.toUpperCase()} • {s.difficulty} • +{s.reward_xp} XP • +{s.reward_coins} koin
          </p>
          <p>{s.description}</p>
          <textarea
            placeholder="Tulis jawabanmu..."
            value={answer[s.id] || ''}
            onChange={(e) => setAnswer({ ...answer, [s.id]: e.target.value })}
          />
          <br /><br />
          <button onClick={() => submit(s.id)} disabled={!answer[s.id] || answer[s.id].length < 5}>
            Kumpulkan
          </button>
        </div>
      ))}
    </div>
  );
}