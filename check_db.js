import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'leads.db');
console.log('Opening DB at:', dbPath);

try {
  const db = new Database(dbPath);
  
  // Get all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
  console.log('Tables in DB:', tables);

  for (const table of tables) {
    const tableName = table.name;
    const schema = db.prepare(`PRAGMA table_info(${tableName})`).all();
    console.log(`\nSchema for table ${tableName}:`);
    console.table(schema);
  }
  
} catch (err) {
  console.error('Error checking DB:', err);
}
