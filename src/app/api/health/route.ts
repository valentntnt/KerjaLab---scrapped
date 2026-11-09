import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    await pool.query('SELECT 1');
    return NextResponse.json({ status: 'ok', db: 'connected', timestamp: new Date().toISOString() }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ status: 'error', db: 'disconnected' }, { status: 503 });
  }
}