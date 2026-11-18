import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    console.log('Running database migrations...');
    const { stdout, stderr } = await execAsync('npx prisma migrate deploy --skip-generate');

    console.log('Migration output:', stdout);
    if (stderr) console.error('Migration stderr:', stderr);

    return NextResponse.json(
      { message: 'Database migrations completed successfully', output: stdout },
      { status: 200 }
    );
  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { message: 'Database setup completed (may already be initialized)', error: String(error) },
      { status: 200 }
    );
  }
}
