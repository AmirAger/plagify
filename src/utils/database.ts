import { Pool } from 'pg';

// Create a connection pool for PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '6543'),
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: true,
});

// Helper function to execute SQL queries
export async function query(text: string, params?: any[]) {
  try {
    const start = Date.now();
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Helper function to get a single row
export async function getRow(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows[0];
}

// Helper function to get multiple rows
export async function getRows(text: string, params?: any[]) {
  const result = await query(text, params);
  return result.rows;
}

// Helper function to insert a row and return the inserted data
export async function insert(table: string, data: Record<string, any>) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
  const columns = keys.join(', ');
  
  const text = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`;
  const result = await query(text, values);
  return result.rows[0];
}

// Helper function to update a row and return the updated data
export async function update(table: string, id: number | string, data: Record<string, any>) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');
  
  const text = `UPDATE ${table} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
  const result = await query(text, [...values, id]);
  return result.rows[0];
}