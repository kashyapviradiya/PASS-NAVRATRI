import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const file = searchParams.get('file');

  if (!file) {
    return new NextResponse('File parameter missing', { status: 400 });
  }

  try {
    // Only allow reading from the specific artifacts directory for security
    const artifactDir = 'C:\\Users\\kashy\\.gemini\\antigravity\\brain\\7d3e34c7-58d5-4b7a-b856-deed95811da1';
    
    // Check if it's a valid artifact image
    if (!file.startsWith(artifactDir) || !file.endsWith('.jpg')) {
      return new NextResponse('Invalid file path', { status: 403 });
    }

    const imageBuffer = fs.readFileSync(file);
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Error serving demo image:', error);
    return new NextResponse('Image not found', { status: 404 });
  }
}
