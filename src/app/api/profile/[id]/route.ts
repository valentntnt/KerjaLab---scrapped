import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    const user = await pool.query(
      'SELECT id, username, email, xp, coins, level, created_at FROM users WHERE id = $1',
      [userId]
    );
    if (user.rowCount === 0) {
      return NextResponse.json({ error: 'User tidak ditemukan' }, { status: 404 });
    }

    const history = await pool.query(
      `SELECT s.id, s.score, s.xp_gained, s.coins_gained, s.submitted_at,
              sim.title, sim.category, sim.difficulty
       FROM submissions s
       JOIN simulations sim ON s.simulation_id = sim.id
       WHERE s.user_id = $1
       ORDER BY s.submitted_at DESC
       LIMIT 20`,
      [userId]
    );

    return NextResponse.json(
      { user: user.rows[0], history: history.rows },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}