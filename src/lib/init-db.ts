import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function initializeDatabase() {
  try {
    console.log('Initializing database...');
    await execAsync('npx prisma migrate deploy --skip-generate');
    console.log('Database initialized successfully');
  } catch (error) {
    console.warn('Database initialization warning:', error);
    // Don't fail silently, but continue
  }
}
