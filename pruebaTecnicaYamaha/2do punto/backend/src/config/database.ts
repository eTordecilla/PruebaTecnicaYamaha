import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'yamaha_ventas',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test de conexión
pool.on('connect', () => {
  console.log('✅ Conexión a PostgreSQL establecida');
});

pool.on('error', (err) => {
  console.error('❌ Error en pool de PostgreSQL:', err);
  process.exit(-1);
});

export default pool;