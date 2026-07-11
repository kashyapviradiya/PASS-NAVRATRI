import EventForm from '../../components/EventForm';
import { adminDb } from '@/lib/firebase-admin';
import { notFound } from 'next/navigation';

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const doc = await adminDb.collection('events').doc(params.id).get();
  
  if (!doc.exists) {
    notFound();
  }

  const eventData = doc.data() as any;

  return (
    <div className="p-8">
      <EventForm isEdit={true} initialData={eventData} />
    </div>
  );
}
