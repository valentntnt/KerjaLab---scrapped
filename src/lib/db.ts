import { Pool } from 'pg';

const globalForPg = global as unknown as { pool: Pool | undefined };

export const pool =
  globalForPg.pool ??
  new Pool({
    host: process.env.POSTGRES_HOST || 'db',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    max: 10,
  });

if (process.env.NODE_ENV !== 'production') globalForPg.pool = pool;