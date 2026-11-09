import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(
      'SELECT id, title, category, difficulty, description, reward_xp, reward_coins FROM simulations ORDER BY id'
    );
    return NextResponse.json({ data: result.rows }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}