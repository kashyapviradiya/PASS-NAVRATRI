import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';

async function uploadBase64(base64String: string, path: string): Promise<string> {
  if (!base64String.startsWith('data:image')) return base64String;
  const matches = base64String.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  if (!matches || matches.length !== 3) throw new Error('Invalid base64 string');
  
  const type = matches[1];
  const buffer = Buffer.from(matches[2], 'base64');
  const bucket = adminStorage.bucket();
  const file = bucket.file(path);

  await file.save(buffer, { metadata: { contentType: type }, public: true });
  return `https://storage.googleapis.com/${bucket.name}/${path}`;
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const doc = await adminDb.collection('events').doc(params.id).get();
    if (!doc.exists) {
      return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, event: doc.data() });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await request.json();
    const eventId = params.id;

    let bannerImage = data.bannerImage || '';
    if (bannerImage.startsWith('data:image')) {
      bannerImage = await uploadBase64(bannerImage, `events/${eventId}/banner-${Date.now()}`);
    }

    const gallery: string[] = [];
    if (data.gallery && Array.isArray(data.gallery)) {
      for (let i = 0; i < data.gallery.length; i++) {
        let img = data.gallery[i];
        if (img.startsWith('data:image')) {
          img = await uploadBase64(img, `events/${eventId}/gallery-${i}-${Date.now()}`);
        }
        gallery.push(img);
      }
    }

    const updateData = {
      title: data.title,
      description: data.description,
      bannerImage,
      gallery,
      city: data.city,
      venue: data.venue,
      address: data.address,
      startDate: data.startDate,
      endDate: data.endDate,
      ticketTypes: data.ticketTypes || [],
      updatedAt: new Date().toISOString(),
    };

    await adminDb.collection('events').doc(eventId).update(updateData);

    return NextResponse.json({ success: true, message: 'Event updated successfully' });
  } catch (error: any) {
    console.error('Error updating event:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await adminDb.collection('events').doc(params.id).delete();
    // In a real app, also delete the files from Storage
    return NextResponse.json({ success: true, message: 'Event deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
