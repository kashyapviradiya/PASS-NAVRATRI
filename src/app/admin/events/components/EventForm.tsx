'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Image as ImageIcon, X, Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react';
import type { Event, TicketType } from '@/types';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface EventFormProps {
  initialData?: Event;
  isEdit?: boolean;
}

export default function EventForm({ initialData, isEdit }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [city, setCity] = useState(initialData?.city || '');
  const [venue, setVenue] = useState(initialData?.venue || '');
  const [address, setAddress] = useState(initialData?.address || '');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [status, setStatus] = useState<Event['status']>(initialData?.status || 'draft');

  // Media
  const [bannerImage, setBannerImage] = useState<string>(initialData?.bannerImage || '');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Tickets
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(initialData?.ticketTypes || []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'banner' | 'gallery') => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'banner') {
          setBannerImage(base64String);
        } else {
          setGallery(prev => [...prev, base64String]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeGalleryImage = (index: number) => {
    setGallery(prev => prev.filter((_, i) => i !== index));
  };

  const addTicketType = () => {
    setTicketTypes([...ticketTypes, {
      id: `tt_${Date.now()}`,
      name: '',
      price: 0,
      benefits: [],
      totalInventory: 100,
      soldQuantity: 0,
      remainingQuantity: 100,
      status: 'available'
    }]);
  };

  const updateTicketType = (id: string, field: keyof TicketType, value: any) => {
    setTicketTypes(ticketTypes.map(tt => {
      if (tt.id === id) {
        if (field === 'totalInventory') {
          return { ...tt, totalInventory: value, remainingQuantity: value - tt.soldQuantity };
        }
        return { ...tt, [field]: value };
      }
      return tt;
    }));
  };

  const removeTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter(tt => tt.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate || !endDate) {
      toast.error('Title, Start Date, and End Date are required.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(isEdit ? 'Updating event...' : 'Creating event...');

    const payload = {
      title, description, city, venue, address, startDate, endDate, status,
      bannerImage, gallery, ticketTypes
    };

    try {
      const url = isEdit ? `/api/admin/events/${initialData?.id}` : '/api/admin/events';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(isEdit ? 'Event updated successfully' : 'Event created successfully', { id: toastId });
        router.push('/admin/events');
        router.refresh();
      } else {
        toast.error(data.message || 'Something went wrong', { id: toastId });
      }
    } catch (error) {
      toast.error('Network error', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* Header Actions */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/admin/events" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-serif font-bold text-gray-900">{isEdit ? 'Edit Event' : 'Create New Event'}</h1>
            <p className="text-sm text-gray-500">Fill in the details to publish your event.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => router.push('/admin/events')} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors text-sm">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl font-bold text-white bg-navratri-primary hover:bg-red-700 transition-colors flex items-center gap-2 text-sm shadow-lg shadow-navratri-primary/20 disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isEdit ? 'Save Changes' : 'Create Event'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Basic Information</h2>
            
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Event Title *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="e.g. Navratri Mahotsav 2026" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-gold focus:border-transparent outline-none transition-all font-medium text-gray-900" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Description</label>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Describe the event, artists, and rules..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-gold focus:border-transparent outline-none transition-all text-sm text-gray-900"></textarea>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navratri-gold focus:border-transparent outline-none transition-all font-medium text-gray-900">
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Live)</option>
                  <option value="sold_out">Sold Out</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Location & Schedule</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Venue Name</label>
                <input type="text" value={venue} onChange={e => setVenue(e.target.value)} placeholder="e.g. GMDC Ground" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">City</label>
                <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Ahmedabad" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Full Address</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Full street address..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">Start Date/Time *</label>
                <input type="datetime-local" required value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">End Date/Time *</label>
                <input type="datetime-local" required value={endDate} onChange={e => setEndDate(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-medium text-gray-900" />
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-6">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Ticket Types</h2>
              <button type="button" onClick={addTicketType} className="flex items-center gap-1 text-sm font-bold text-navratri-primary hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-lg">
                <Plus className="w-4 h-4" /> Add Ticket
              </button>
            </div>
            
            <div className="space-y-4">
              {ticketTypes.map((tt, index) => (
                <div key={tt.id} className="p-5 border border-gray-200 rounded-2xl bg-gray-50 relative group">
                  <button type="button" onClick={() => removeTicketType(tt.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pass Name</label>
                      <input type="text" value={tt.name} onChange={e => updateTicketType(tt.id, 'name', e.target.value)} placeholder="e.g. VIP Pass" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price (₹)</label>
                      <input type="number" value={tt.price} onChange={e => updateTicketType(tt.id, 'price', Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Inventory</label>
                      <input type="number" value={tt.totalInventory} onChange={e => updateTicketType(tt.id, 'totalInventory', Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</label>
                      <select value={tt.status} onChange={e => updateTicketType(tt.id, 'status', e.target.value)} className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium">
                        <option value="available">Available</option>
                        <option value="sold_out">Sold Out</option>
                        <option value="hidden">Hidden</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {ticketTypes.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                  No ticket types added yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Media) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Event Banner</h2>
            <div className="aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group">
              {bannerImage ? (
                <>
                  <img src={bannerImage} alt="Banner" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button type="button" onClick={() => setBannerImage('')} className="bg-white text-red-500 p-2 rounded-full">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center p-4">
                  <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 font-medium">Click to upload banner</p>
                </div>
              )}
              <input type="file" ref={bannerInputRef} onChange={e => handleImageUpload(e, 'banner')} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" title="Upload Banner" />
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">Gallery</h2>
              <button type="button" onClick={() => galleryInputRef.current?.click()} className="text-navratri-primary text-sm font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add
              </button>
            </div>
            
            <input type="file" ref={galleryInputRef} onChange={e => handleImageUpload(e, 'gallery')} accept="image/*" multiple className="hidden" />

            <div className="grid grid-cols-2 gap-3">
              {gallery.map((img, idx) => (
                <div key={idx} className="aspect-square bg-gray-100 rounded-xl relative group overflow-hidden">
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button type="button" onClick={() => removeGalleryImage(idx)} className="bg-white text-red-500 p-1.5 rounded-full">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {gallery.length === 0 && (
                <div className="col-span-2 aspect-[2/1] border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-400 text-xs font-medium">
                  No images added
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </form>
  );
}
