'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Loader2, UserPlus, Eye, EyeOff, Copy, Check, Power, ChevronDown, X, Shield } from 'lucide-react';
import toast from 'react-hot-toast';

interface Organizer {
  id: string;
  name: string;
  companyName: string;
  email: string;
  mobile: string;
  active: boolean;
  assignedEventIds: string[];
  permissions: Record<string, boolean>;
  plainPassword?: string;
  createdAt: string;
}

interface EventItem {
  id: string;
  title: string;
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [copiedId, setCopiedId] = useState('');
  const [visiblePasswordId, setVisiblePasswordId] = useState('');
  // Form state
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    companyName: '',
    mobile: '',
    assignedEventIds: [] as string[],
  });

  const fetchOrganizers = async () => {
    try {
      const res = await fetch('/api/admin/organizers');
      const data = await res.json();
      if (data.success) setOrganizers(data.organizers);
    } catch { toast.error('Failed to load organizers'); }
    finally { setLoading(false); }
  };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/admin/events');
      const data = await res.json();
      if (data.success) setEvents(data.events.map((e: any) => ({ id: e.id, title: e.title || e.name })));
    } catch { /* silent */ }
  };

  useEffect(() => { fetchOrganizers(); fetchEvents(); }, []);

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let pw = '';
    for (let i = 0; i < 12; i++) pw += chars.charAt(Math.floor(Math.random() * chars.length));
    setForm(prev => ({ ...prev, password: pw }));
    setShowPassword(true);
  };

  const handleCreate = async () => {
    if (!form.name || !form.email || !form.password) {
      toast.error('Name, Email and Password are required');
      return;
    }
    if (form.assignedEventIds.length === 0) {
      toast.error('Please assign at least one event');
      return;
    }

    setCreating(true);
    const toastId = toast.loading('Creating organizer account...');
    try {
      const res = await fetch('/api/admin/organizers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();

      if (data.success) {
        toast.success('Organizer created!', { id: toastId });
        setOrganizers(prev => [data.organizer, ...prev]);
        setShowModal(false);
        setForm({ name: '', email: '', password: '', companyName: '', mobile: '', assignedEventIds: [] });
        setShowPassword(false);
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch {
      toast.error('Network error', { id: toastId });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure? This will permanently remove this organizer account.')) return;
    const toastId = toast.loading('Deleting...');
    try {
      const res = await fetch(`/api/admin/organizers?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        toast.success('Organizer deleted', { id: toastId });
        setOrganizers(prev => prev.filter(o => o.id !== id));
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    const toastId = toast.loading(currentActive ? 'Deactivating...' : 'Activating...');
    try {
      const res = await fetch('/api/admin/organizers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, active: !currentActive })
      });
      const data = await res.json();
      if (data.success) {
        toast.success(data.message, { id: toastId });
        setOrganizers(prev => prev.map(o => o.id === id ? { ...o, active: !currentActive } : o));
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch {
      toast.error('Network error', { id: toastId });
    }
  };

  const handleCopyCredentials = (org: Organizer) => {
    const text = `Organizer Login\nURL: ${window.location.origin}/organizer/login\nEmail: ${org.email}\nPassword: ${org.plainPassword || '(not available)'}`;
    navigator.clipboard.writeText(text);
    setCopiedId(org.id);
    toast.success('Login credentials copied!');
    setTimeout(() => setCopiedId(''), 2000);
  };

  const toggleEvent = (eventId: string) => {
    setForm(prev => ({
      ...prev,
      assignedEventIds: prev.assignedEventIds.includes(eventId)
        ? prev.assignedEventIds.filter(id => id !== eventId)
        : [...prev.assignedEventIds, eventId]
    }));
  };

  const getEventName = (eventId: string) => {
    return events.find(e => e.id === eventId)?.title || eventId;
  };

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[28px] font-[850] text-navratri-text tracking-tight">Organizer Accounts</h1>
          <p className="text-[14px] text-navratri-muted font-[500] mt-1">Create login credentials for event organizers</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-navratri-primary text-white font-[700] px-5 py-3 rounded-[14px] hover:opacity-90 transition-all shadow-sm text-[14px] active:scale-95"
        >
          <UserPlus className="w-4 h-4" /> New Organizer
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-navratri-primary" />
        </div>
      ) : organizers.length === 0 ? (
        <div className="bg-white rounded-[20px] border border-navratri-lightGrey p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-navratri-softBg rounded-full flex items-center justify-center mx-auto mb-4 border border-navratri-border">
            <Shield className="w-7 h-7 text-navratri-muted" />
          </div>
          <h2 className="text-[18px] font-[800] text-navratri-text mb-2">No Organizers Yet</h2>
          <p className="text-[14px] text-navratri-muted font-[500] max-w-sm mx-auto mb-6">
            Create an organizer account and assign them events. They can then log in at the Organizer Portal.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-navratri-primary text-white font-[700] px-6 py-3 rounded-[14px] hover:opacity-90 transition-all text-[14px] active:scale-95"
          >
            <UserPlus className="w-4 h-4 inline mr-2" /> Create First Organizer
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {organizers.map(org => (
            <div key={org.id} className="card-base p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Avatar & Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center font-[800] text-[18px] shrink-0 ${org.active ? 'bg-navratri-primary/10 text-navratri-primary' : 'bg-gray-100 text-gray-400'}`}>
                    {org.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-[800] text-[16px] text-navratri-text truncate">{org.name}</h3>
                      <span className={`text-[10px] font-[800] px-2.5 py-1 rounded-full uppercase tracking-widest ${org.active ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                        {org.active ? 'Active' : 'Disabled'}
                      </span>
                    </div>
                    <p className="text-[13px] text-navratri-muted font-[500] truncate">{org.email}</p>
                    {org.companyName && <p className="text-[12px] text-navratri-muted/70 font-[500]">{org.companyName}</p>}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[11px] font-[700] text-navratri-muted">Password:</span>
                      {visiblePasswordId === org.id ? (
                        <>
                          <span className="text-[12px] font-mono font-[700] text-navratri-primary select-all">{org.plainPassword || '—'}</span>
                          <button onClick={() => setVisiblePasswordId('')} className="p-0.5 text-navratri-muted hover:text-navratri-text"><EyeOff className="w-3.5 h-3.5" /></button>
                        </>
                      ) : (
                        <>
                          <span className="text-[12px] font-[700] text-navratri-muted tracking-widest">••••••••</span>
                          <button onClick={() => setVisiblePasswordId(org.id)} className="p-0.5 text-navratri-muted hover:text-navratri-text"><Eye className="w-3.5 h-3.5" /></button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Assigned Events */}
                <div className="flex-1 min-w-0 hidden md:block">
                  <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1.5">Assigned Events</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(org.assignedEventIds || []).slice(0, 3).map(eid => (
                      <span key={eid} className="text-[11px] font-[700] bg-navratri-softBg text-navratri-text px-2.5 py-1 rounded-[8px] truncate max-w-[150px]">
                        {getEventName(eid)}
                      </span>
                    ))}
                    {(org.assignedEventIds || []).length > 3 && (
                      <span className="text-[11px] font-[700] bg-navratri-softBg text-navratri-muted px-2.5 py-1 rounded-[8px]">
                        +{org.assignedEventIds.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCopyCredentials(org)}
                    className="p-2.5 rounded-[10px] bg-navratri-softBg text-navratri-muted hover:text-navratri-primary hover:bg-navratri-primary/10 transition-colors"
                    title="Copy login info"
                  >
                    {copiedId === org.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleToggleActive(org.id, org.active)}
                    className={`p-2.5 rounded-[10px] transition-colors ${org.active ? 'bg-orange-50 text-orange-500 hover:bg-orange-100' : 'bg-emerald-50 text-emerald-500 hover:bg-emerald-100'}`}
                    title={org.active ? 'Deactivate' : 'Activate'}
                  >
                    <Power className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(org.id)}
                    className="p-2.5 rounded-[10px] bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
                    title="Delete organizer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Mobile: Assigned Events */}
              <div className="md:hidden mt-3 pt-3 border-t border-navratri-lightGrey">
                <p className="text-[10px] font-[800] text-navratri-muted uppercase tracking-widest mb-1.5">Assigned Events</p>
                <div className="flex flex-wrap gap-1.5">
                  {(org.assignedEventIds || []).map(eid => (
                    <span key={eid} className="text-[11px] font-[700] bg-navratri-softBg text-navratri-text px-2.5 py-1 rounded-[8px] truncate max-w-[200px]">
                      {getEventName(eid)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="card-base w-full max-w-lg max-h-[90vh] overflow-y-auto p-0">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-navratri-lightGrey">
              <div>
                <h2 className="text-[20px] font-[800] text-navratri-text">Create Organizer</h2>
                <p className="text-[13px] text-navratri-muted font-[500] mt-0.5">Set up login credentials and assign events</p>
              </div>
              <button onClick={() => { setShowModal(false); setShowPassword(false); }} className="p-2 bg-gray-100 rounded-[10px] hover:bg-gray-200 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-2">Organizer Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Royal Events"
                  className="input-field"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-2">Company Name</label>
                <input
                  type="text"
                  value={form.companyName}
                  onChange={e => setForm(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="Royal Events Gujarat Pvt Ltd"
                  className="input-field"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-2">Login Email *</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="organizer@company.com"
                  className="input-field"
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-2">Mobile</label>
                <input
                  type="tel"
                  value={form.mobile}
                  onChange={e => setForm(prev => ({ ...prev, mobile: e.target.value }))}
                  placeholder="9876543210"
                  className="input-field"
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-[12px] font-[800] text-navratri-muted uppercase tracking-widest">Login Password *</label>
                  <button 
                    type="button" 
                    onClick={generatePassword} 
                    className="text-[11px] font-[800] text-navratri-primary hover:text-navratri-secondary transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Auto Generate
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter custom password"
                    className="input-field pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-navratri-muted hover:text-navratri-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Assign Events */}
              <div>
                <label className="block text-[12px] font-[800] text-navratri-muted uppercase tracking-widest mb-2">Assign Events *</label>
                <div className="bg-navratri-softBg border border-navratri-lightGrey rounded-[14px] p-3 max-h-[200px] overflow-y-auto space-y-1.5">
                  {events.length === 0 ? (
                    <p className="text-[13px] text-navratri-muted font-[500] text-center py-4">No events found. Create events first.</p>
                  ) : (
                    events.map(event => (
                      <label
                        key={event.id}
                        className={`flex items-center gap-3 p-3 rounded-[10px] cursor-pointer transition-all ${
                          form.assignedEventIds.includes(event.id)
                            ? 'bg-navratri-primary/10 border border-navratri-primary/30'
                            : 'bg-white border border-transparent hover:border-navratri-lightGrey'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.assignedEventIds.includes(event.id)}
                          onChange={() => toggleEvent(event.id)}
                          className="w-4 h-4 accent-navratri-primary rounded"
                        />
                        <span className="text-[14px] font-[600] text-navratri-text truncate">{event.title}</span>
                      </label>
                    ))
                  )}
                </div>
                {form.assignedEventIds.length > 0 && (
                  <p className="text-[12px] font-[700] text-navratri-primary mt-2">{form.assignedEventIds.length} event(s) selected</p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-navratri-lightGrey flex gap-3">
              <button
                onClick={() => { setShowModal(false); setShowPassword(false); }}
                className="flex-1 py-3.5 bg-gray-100 text-gray-600 font-[700] rounded-[14px] hover:bg-gray-200 transition-colors text-[14px]"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                disabled={creating}
                className="btn-primary flex-1 py-3.5 text-[14px] flex items-center justify-center gap-2"
              >
                {creating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creating...</> : <><Plus className="w-4 h-4" /> Create Account</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
