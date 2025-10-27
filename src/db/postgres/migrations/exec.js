import 'dotenv/config';
import { pool } from '../helper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const execMigrations = async () => {
  const client = await pool.connect();
  try {
    const files = fs.readdirSync(__dirname).filter((file) => {
      return file.endsWith('.sql');
    });

    for (const file of files) {
      const filePath = path.join(__dirname, file);
      const script = fs.readFileSync(filePath, 'utf8');
      await client.query(script);

      console.log(`Migration for ${file} executed successfully`);
    }

    console.log('All migrations executed successfully');
  } catch (error) {
    console.error(error);
  } finally {
    client.release();
  }
};

execMigrations();
