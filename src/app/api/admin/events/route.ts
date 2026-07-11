import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';

// Helper to upload base64 image to Firebase Storage
async function uploadBase64(base64String: string, path: string): Promise<string> {
  if (!base64String.startsWith('data:image')) return base64String; // Might already be a URL
  
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 string');
  }

  const type = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const bucket = adminStorage.bucket();
  const file = bucket.file(path);

  await file.save(buffer, {
    metadata: { contentType: type },
    public: true, // Make it publicly readable
  });

  // Get public URL
  return `https://storage.googleapis.com/${bucket.name}/${path}`;
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
