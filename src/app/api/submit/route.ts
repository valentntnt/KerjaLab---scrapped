import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, simulationId, answer } = body;

    // Validasi
    if (!userId || !simulationId || !answer || answer.trim().length < 5) {
      return NextResponse.json(
        { error: 'userId, simulationId, dan answer (min 5 karakter) wajib diisi' },
        { status: 400 }
      );
    }

    // Ambil reward dari simulation
    const sim = await pool.query(
      'SELECT reward_xp, reward_coins FROM simulations WHERE id = $1',
      [simulationId]
    );
    if (sim.rowCount === 0) {
      return NextResponse.json({ error: 'Simulasi tidak ditemukan' }, { status: 404 });
    }
    const { reward_xp, reward_coins } = sim.rows[0];

    // Hitung skor sederhana (panjang jawaban sebagai proksi)
    const score = Math.min(100, Math.floor(answer.trim().length / 2));
    const xpGained = Math.floor((score / 100) * reward_xp);
    const coinsGained = Math.floor((score / 100) * reward_coins);

    // Transaksi: insert submission + update user
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      const insert = await client.query(
        `INSERT INTO submissions (user_id, simulation_id, answer, score, xp_gained, coins_gained)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, score, xp_gained, coins_gained`,
        [userId, simulationId, answer.trim(), score, xpGained, coinsGained]
      );

      await client.query(
        `UPDATE users
         SET xp = xp + $1,
             coins = coins + $2,
             level = GREATEST(1, FLOOR((xp + $1) / 100) + 1)
         WHERE id = $3`,
        [xpGained, coinsGained, userId]
      );

      await client.query('COMMIT');
      return NextResponse.json(
        {
          message: 'Submission berhasil',
          submission: insert.rows[0],
        },
        { status: 201 }
      );
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}