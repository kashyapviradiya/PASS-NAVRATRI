import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const targetDir = path.join(process.cwd(), 'src/app/ticket/[id]');
    if (fs.existsSync(targetDir)) {
      fs.rmSync(targetDir, { recursive: true, force: true });
    }
    return NextResponse.json({ success: true, message: 'Deleted [id]' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
