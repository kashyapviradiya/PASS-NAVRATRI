import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';

import fs from 'fs';
import path from 'path';

// Helper to upload base64 image to Firebase Storage or Fallback locally
async function uploadBase64(base64String: string, filePath: string): Promise<string> {
  if (!base64String.startsWith('data:image')) return base64String;
  
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const type = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  
  try {
    const bucket = adminStorage.bucket();
    const file = bucket.file(filePath);
    await file.save(buffer, {
      metadata: { contentType: type },
      public: true, // Make it publicly readable
    });
    return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
  } catch (error: any) {
    console.warn("Firebase Storage failed, falling back to local storage.", error.message);
    
    // Fallback: Save to public/uploads directory locally
    try {
      const ext = type.split('/')[1] || 'jpg';
      // Sanitize filepath for local windows/linux saving
      const safePath = filePath.replace(/[^a-zA-Z0-9-]/g, '-');
      const fileName = `${safePath}.${ext}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads');
      
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      fs.writeFileSync(path.join(uploadDir, fileName), buffer);
      return `/uploads/${fileName}`;
    } catch (localError) {
      console.error("Local save also failed", localError);
      throw new Error('Could not save image to Firebase or Local Storage.');
    }
  }
}

export async function GET() {
  try {
    const snapshot = await adminDb.collection('events').orderBy('createdAt', 'desc').get();
    const events = snapshot.docs.map(doc => doc.data());
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error('Error fetching events:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newId = adminDb.collection('events').doc().id;
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    let bannerImage = data.bannerImage || '';
    if (bannerImage.startsWith('data:image')) {
      bannerImage = await uploadBase64(bannerImage, `events/${newId}/banner-${Date.now()}`);
    }

    const gallery: string[] = [];
    if (data.gallery && Array.isArray(data.gallery)) {
      for (let i = 0; i < data.gallery.length; i++) {
        let img = data.gallery[i];
        if (img.startsWith('data:image')) {
          img = await uploadBase64(img, `events/${newId}/gallery-${i}-${Date.now()}`);
        }
        gallery.push(img);
      }
    }

    const event = {
      id: newId,
      slug,
      title: data.title,
      description: data.description || '',
      bannerImage,
      gallery,
      city: data.city || '',
      venue: data.venue || '',
      address: data.address || '',
      startDate: data.startDate || '',
      endDate: data.endDate || '',
      status: data.status || 'draft',
      ticketTypes: data.ticketTypes || [],
      mapLink: data.mapLink || '',
      reportingTime: data.reportingTime || '',
      organizerPhone: data.organizerPhone || '',
      emergencyPhone: data.emergencyPhone || '',
      venueInstructions: data.venueInstructions || '',
      amenities: data.amenities || { parking: false, food: false, washroom: false, security: false },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('events').doc(newId).set(event);

    return NextResponse.json({ success: true, event });
  } catch (error: any) {
    console.error('Error creating event:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
