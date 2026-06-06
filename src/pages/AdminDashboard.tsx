import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Calendar, DollarSign, XCircle, RefreshCw, AlertTriangle, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Booking {
  id: number;
  client_name: string;
  client_email: string;
  service: string;
  status: string;
  created_at: string;
  updated_at: string;
  stripe_payment_intent_id?: string;
}

export function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchBookings();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const statusColumns = [
    { name: 'Booked but Unpaid', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Paid and Confirmed', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Payment Failed', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { name: 'Cancelled', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    { name: 'Rescheduled', icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-400/10' }
  ];

  const filteredBookings = bookings.filter(b => 
    b.client_name.toLowerCase().includes(search.toLowerCase()) || 
    b.client_email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] pt-32 pb-24 px-4 sm:px-6 relative text-white">
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-[var(--color-ares-bg)] pointer-events-none -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[var(--color-ares-teal)]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Staff Operations Board</h1>
            <p className="text-white/50 text-sm">Centralized booking & payment system oversight.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input 
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
            />
          </div>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-[var(--color-ares-teal)] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory">
            {statusColumns.map((col) => {
              const colBookings = filteredBookings.filter(b => b.status === col.name);
              
              return (
                <div key={col.name} className="flex-1 min-w-[320px] shrink-0 snap-start">
                  <div className={`p-4 rounded-t-xl border border-b-0 border-white/10 flex items-center justify-between ${col.bg}`}>
                    <div className="flex items-center gap-2">
                      <col.icon className={`w-4 h-4 ${col.color}`} />
                      <h2 className="font-semibold text-sm tracking-wide">{col.name}</h2>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 bg-black/40 rounded-full">{colBookings.length}</span>
                  </div>
                  <div className="p-4 bg-black/20 border border-white/10 rounded-b-xl min-h-[500px] flex flex-col gap-3">
                    {colBookings.length === 0 ? (
                      <div className="text-white/20 text-xs text-center mt-6">No reservations</div>
                    ) : (
                      colBookings.map((booking) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          key={booking.id} 
                          className="bg-[var(--color-ares-charcoal)] border border-white/10 p-4 rounded-lg shadow-lg group relative overflow-hidden"
                        >
                          <div className="flex flex-col gap-1 mb-3">
                            <h3 className="font-bold text-sm text-white">{booking.client_name}</h3>
                            <a href={`mailto:${booking.client_email}`} className="text-xs text-[var(--color-ares-teal)] hover:underline truncate">
                              {booking.client_email}
                            </a>
                            <div className="text-xs text-white/50 bg-black/30 w-fit px-2 py-1 rounded inline-flex gap-1 items-center mt-1">
                              <Calendar className="w-3 h-3" />
                              {booking.service}
                            </div>
                          </div>

                          {/* Date/Status display */}
                          <div className="flex justify-between items-end mt-2 pt-3 border-t border-white/5">
                            <div className="text-[10px] text-white/40 font-mono flex flex-col">
                              <span>ID: {booking.id.toString().padStart(4, '0')}</span>
                              <span>{new Date(booking.created_at).toLocaleDateString()}</span>
                            </div>

                            {/* Dropdown for quick actions */}
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <select 
                                onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                                value={booking.status}
                                className="text-xs bg-black border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[var(--color-ares-teal)] cursor-pointer"
                              >
                                {statusColumns.map(s => (
                                  <option key={s.name} value={s.name}>{s.name}</option>
                                ))}
                              </select>
                            </div>
                          </div>

                          {/* Left indicator accent */}
                          <div className={`absolute top-0 left-0 w-1 h-full ${col.bg.replace('/10', '')} opacity-50`} />
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {/* Helper Note component bottom */}
        <div className="mt-8 p-4 bg-black/30 border border-white/10 rounded-xl max-w-3xl">
           <h4 className="text-sm font-bold flex items-center gap-2 mb-2">
             <DollarSign className="w-4 h-4 text-emerald-400" />
             Webhook Integration Note
           </h4>
           <p className="text-xs text-white/50 leading-relaxed">
             This dashboard reads in real-time from the backend. When a <code className="text-white/70">payment_intent.succeeded</code> or <code className="text-white/70">payment_intent.payment_failed</code> webhook 
             event hits the <code className="text-[var(--color-ares-teal)]">/api/webhooks/stripe</code> endpoint, the 
             booking status is automatically updated and confirmation/retry emails are dispatched.
           </p>
        </div>
      </div>
    </div>
  );
}
