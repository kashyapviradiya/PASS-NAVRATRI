import EventForm from '../components/EventForm';

export default function NewEventPage() {
  return (
    <div className="p-8">
      <EventForm isEdit={false} />
    </div>
  );
}
