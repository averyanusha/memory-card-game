import pg from 'pg';
import { DB_URL } from './config.js';
const { Pool } = pg;


const pool = new Pool({
  connectionString: DB_URL
});

export default pool;