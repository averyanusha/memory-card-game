import pg from 'pg';
import { DATABASE_URL } from './config.js';
const { Pool } = pg;


const pool = new Pool({
  connectionString: DATABASE_URL
});

export default pool;