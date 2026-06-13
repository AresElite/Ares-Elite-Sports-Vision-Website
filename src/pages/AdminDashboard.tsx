import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, Calendar, DollarSign, XCircle, RefreshCw, 
  AlertTriangle, Search, Users, TrendingUp, Mail, Phone, Tag, Award
} from 'lucide-react';

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

interface Lead {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  phone: string | null;
  athlete_name: string | null;
  parent_guardian_name: string | null;
  sport: string | null;
  age: number | null;
  lead_source: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  landing_page: string;
  status: string;
  created_at: string;
  updated_at: string;
  questionnaire_score: number | null;
  assessment_date: string | null;
  how_heard: string | null;
  how_heard_other: string | null;
  referral_code: string | null;
  affiliate_code: string | null;
  referral_partner_name: string | null;
  referral_partner_type: string | null;
  first_touch_source: string | null;
  last_touch_source: string | null;
  conversion_source: string | null;
  assessment_completed_date: string | null;
  evaluation_scheduled_date: string | null;
  evaluation_completed_date: string | null;
  became_client_date: string | null;
  source_confidence: string;
  manually_verified_source: string | null;
  lead_owner: string;
  notes: string | null;
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'bookings' | 'funnel'>('bookings');
  
  // Bookings state
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsSearch, setBookingsSearch] = useState('');
  const [bookingsLoading, setBookingsLoading] = useState(true);
  
  // Leads state
  const [leads, setLeads] = useState<Lead[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [updatingLeadId, setUpdatingLeadId] = useState<number | null>(null);
  const [verifyingLeadId, setVerifyingLeadId] = useState<number | null>(null);
  const [manualVerifiedValues, setManualVerifiedValues] = useState<{ [leadId: number]: string }>({});

  const handleVerifyAttribution = async (id: number) => {
    const value = manualVerifiedValues[id];
    if (!value || !value.trim()) {
      alert("Please enter a verified source channel name.");
      return;
    }
    
    try {
      setVerifyingLeadId(id);
      const res = await fetch(`/api/leads/${id}/attribution`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ manuallyVerifiedSource: value.trim() })
      });
      if (res.ok) {
        alert("Attribution source verified successfully!");
        fetchLeadsAndAnalytics();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("An error occurred during verification.");
    } finally {
      setVerifyingLeadId(null);
    }
  };

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
      setBookingsLoading(false);
    }
  };

  const fetchLeadsAndAnalytics = async () => {
    try {
      const leadsRes = await fetch('/api/leads');
      const analyticsRes = await fetch('/api/funnel-analytics');
      if (leadsRes.ok && analyticsRes.ok) {
        const leadsData = await leadsRes.json();
        const analyticsData = await analyticsRes.json();
        setLeads(leadsData);
        setAnalytics(analyticsData);
      }
    } catch (error) {
      console.error("Failed to fetch leads or analytics", error);
    } finally {
      setLeadsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchLeadsAndAnalytics();
  }, []);

  const handleUpdateBookingStatus = async (id: number, newStatus: string) => {
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

  const handleUpdateLeadStatus = async (id: number, newStatus: string) => {
    try {
      setUpdatingLeadId(id);
      const res = await fetch(`/api/leads/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        await fetchLeadsAndAnalytics();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingLeadId(null);
    }
  };

  const statusColumns = [
    { name: 'Booked but Unpaid', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { name: 'Paid and Confirmed', icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { name: 'Payment Failed', icon: XCircle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { name: 'Cancelled', icon: XCircle, color: 'text-gray-400', bg: 'bg-gray-400/10' },
    { name: 'Rescheduled', icon: RefreshCw, color: 'text-blue-400', bg: 'bg-blue-400/10' }
  ];

  const leadStatuses = [
    'Nurture Campaign Active',
    'Email 1 Sent',
    'Email 2 Sent',
    'Email 3 Sent',
    'Email 4 Sent',
    'Email 5 Sent',
    'Email 6 Sent',
    'Final Follow-Up Sent',
    'Evaluation Scheduled',
    'Became Client',
    'Not Interested',
    'Unsubscribed'
  ];

  const filteredBookings = bookings.filter(b => 
    b.client_name.toLowerCase().includes(bookingsSearch.toLowerCase()) || 
    b.client_email.toLowerCase().includes(bookingsSearch.toLowerCase())
  );

  const filteredLeads = leads.filter(l => 
    `${l.first_name} ${l.last_name || ''}`.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.email.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    (l.sport || '').toLowerCase().includes(leadsSearch.toLowerCase()) ||
    l.status.toLowerCase().includes(leadsSearch.toLowerCase()) ||
    (l.utm_source || '').toLowerCase().includes(leadsSearch.toLowerCase())
  );

  const nurtureStages = [
    { label: 'Active', count: analytics?.stages?.active || 0, color: 'from-[var(--color-ares-teal)] to-[#4FC3F7]' },
    { label: 'Email 1', count: analytics?.stages?.email1 || 0, color: 'from-[#4FC3F7] to-blue-500' },
    { label: 'Email 2', count: analytics?.stages?.email2 || 0, color: 'from-blue-500 to-[var(--color-ares-purple)]' },
    { label: 'Email 3', count: analytics?.stages?.email3 || 0, color: 'from-[var(--color-ares-purple)] to-purple-600' },
    { label: 'Email 4', count: analytics?.stages?.email4 || 0, color: 'from-purple-600 to-indigo-600' },
    { label: 'Email 5', count: analytics?.stages?.email5 || 0, color: 'from-indigo-600 to-amber-500' },
    { label: 'Email 6', count: analytics?.stages?.email6 || 0, color: 'from-amber-500 to-orange-500' },
    { label: 'Final', count: analytics?.stages?.final || 0, color: 'from-orange-500 to-rose-500' }
  ];

  return (
    <div className="min-h-dvh bg-[var(--color-ares-bg)] pt-32 pb-24 px-4 sm:px-6 relative text-white">
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-b from-black/20 to-[var(--color-ares-bg)] pointer-events-none -z-10" />
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-[var(--color-ares-teal)]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2 uppercase">Staff Operations Board</h1>
            <p className="text-white/50 text-sm">Centralized baseline assessments, booking & nurture system telemetry.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setBookingsLoading(true);
                setLeadsLoading(true);
                fetchBookings();
                fetchLeadsAndAnalytics();
              }}
              className="p-2 border border-white/10 hover:border-white/20 bg-black/40 rounded-lg hover:bg-black/60 transition-all text-white/70 hover:text-white"
              title="Refresh Telemetry"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input 
                type="text"
                placeholder={activeTab === 'bookings' ? "Search client bookings..." : "Search leads funnel..."}
                value={activeTab === 'bookings' ? bookingsSearch : leadsSearch}
                onChange={(e) => activeTab === 'bookings' ? setBookingsSearch(e.target.value) : setLeadsSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-black/40 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-ares-teal)] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex gap-6 mb-8 border-b border-white/10 pb-0.5 select-none">
          <button
            onClick={() => setActiveTab('bookings')}
            className={`pb-3 font-bold text-sm tracking-widest uppercase border-b-2 transition-all ${
              activeTab === 'bookings'
                ? 'border-[var(--color-ares-teal)] text-[var(--color-ares-teal)] font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Bookings Board
          </button>
          <button
            onClick={() => setActiveTab('funnel')}
            className={`pb-3 font-bold text-sm tracking-widest uppercase border-b-2 transition-all ${
              activeTab === 'funnel'
                ? 'border-[var(--color-ares-teal)] text-[var(--color-ares-teal)] font-black'
                : 'border-transparent text-white/50 hover:text-white'
            }`}
          >
            Sensory Leads Funnel
          </button>
        </div>

        {/* TAB CONTENT: BOOKINGS */}
        {activeTab === 'bookings' && (
          bookingsLoading ? (
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
                        <h2 className="font-bold text-xs tracking-wider uppercase text-white/90">{col.name}</h2>
                      </div>
                      <span className="text-xs font-mono px-2 py-1 bg-black/40 rounded-full font-bold">{colBookings.length}</span>
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
                              <div className="text-xs text-white/50 bg-black/30 w-fit px-2 py-1 rounded inline-flex gap-1 items-center mt-1 font-mono">
                                <Calendar className="w-3 h-3 text-[var(--color-ares-teal)]" />
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
                                  onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                                  value={booking.status}
                                  className="text-[11px] bg-black border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[var(--color-ares-teal)] cursor-pointer text-white/80"
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
          )
        )}

        {/* TAB CONTENT: LEADS FUNNEL */}
        {activeTab === 'funnel' && (
          leadsLoading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-ares-teal)] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Metric Summaries */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-all">
                    <Users className="w-12 h-12" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block mb-1">New Leads (7d)</span>
                  <span className="text-3xl font-black block text-[var(--color-ares-teal)]">{analytics?.summary?.newLeads7d || 0}</span>
                  <span className="text-xs text-white/40 block mt-2">Captured via digital assessment</span>
                </div>

                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-all">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block mb-1">Evals Scheduled (7d)</span>
                  <span className="text-3xl font-black block text-emerald-400">{analytics?.summary?.evalsBooked7d || 0}</span>
                  <span className="text-xs text-white/40 block mt-2">Conversion Rate: <strong className="text-emerald-400">{analytics?.summary?.conversionRate7d || 0}%</strong></span>
                </div>

                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-all">
                    <RefreshCw className="w-12 h-12" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block mb-1">Active in Nurture</span>
                  <span className="text-3xl font-black block text-[var(--color-ares-purple)]">{analytics?.summary?.activeNurture || 0}</span>
                  <span className="text-xs text-white/40 block mt-2">Drip drip touchpoints active</span>
                </div>

                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl relative overflow-hidden group">
                  <div className="absolute top-4 right-4 text-white/10 group-hover:text-white/20 transition-all">
                    <DollarSign className="w-12 h-12" />
                  </div>
                  <span className="text-[10px] font-mono tracking-widest text-white/50 uppercase block mb-1">Pipeline Value</span>
                  <span className="text-3xl font-black block text-amber-400">${(analytics?.summary?.pipelineOpportunity || 0).toLocaleString()}</span>
                  <span className="text-xs text-white/40 block mt-2">Unscheduled leads * $449 Evaluation</span>
                </div>

              </div>

              {/* Active Nurture Pipeline Visualization */}
              <div className="bg-black/30 border border-white/10 p-6 rounded-2xl">
                <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4">Active Nurture Stage Breakdown</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {nurtureStages.map((stage) => (
                    <div key={stage.label} className="bg-black/40 border border-white/5 p-4 rounded-xl text-center relative">
                      <span className="text-[10px] font-mono text-white/40 block mb-1 uppercase tracking-wider">{stage.label}</span>
                      <span className="text-2xl font-black block text-white">{stage.count}</span>
                      <div className={`absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r ${stage.color} opacity-40 rounded-b-xl`} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Lead Sources & Hot Alerts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Sources Analysis */}
                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl flex flex-col">
                  <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4">Lead Acquisition Sources</h2>
                  <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-[10px] font-mono text-white/40 uppercase">
                          <th className="pb-3">Source Channel</th>
                          <th className="pb-3 text-center">Acquired Leads</th>
                          <th className="pb-3 text-center">Evals Booked</th>
                          <th className="pb-3 text-right">Conversion</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analytics?.sources?.length === 0 ? (
                          <tr><td colSpan={4} className="py-4 text-xs text-center text-white/20">No source data logs</td></tr>
                        ) : (
                          analytics?.sources?.map((s: any) => (
                            <tr key={s.source} className="border-b border-white/5 text-sm">
                              <td className="py-3 font-semibold text-white/80">{s.source}</td>
                              <td className="py-3 text-center font-mono">{s.count}</td>
                              <td className="py-3 text-center font-mono text-emerald-400">{s.converted}</td>
                              <td className="py-3 text-right font-mono text-amber-400 font-bold">{s.rate}%</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Hot Follow-up Alerts */}
                <div className="bg-black/30 border border-white/10 p-6 rounded-2xl flex flex-col">
                  <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase mb-4">Recent Hot Leads (Action Recommended)</h2>
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[260px] pr-1">
                    {analytics?.hotLeads?.length === 0 ? (
                      <div className="text-xs text-white/20 text-center py-12">No high-priority outreach alerts</div>
                    ) : (
                      analytics?.hotLeads?.map((l: any) => (
                        <div key={l.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-sm text-white truncate">{l.name}</h3>
                              <span className="text-[9px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded-full font-bold uppercase shrink-0">
                                {l.reason}
                              </span>
                            </div>
                            <p className="text-xs text-white/40 truncate">Sport: {l.sport} // Status: {l.status}</p>
                          </div>
                          <a 
                            href={`mailto:${l.email}?subject=ARES Elite Sports Vision - Baseline Evaluation Inquiry`}
                            className="bg-[var(--color-ares-teal)] hover:bg-[#4FC3F7] text-[#0A0B14] p-2 rounded-lg font-bold text-xs tracking-wider uppercase shrink-0 transition-colors inline-flex items-center gap-1.5"
                          >
                            <Mail className="w-3.5 h-3.5" />
                            Email
                          </a>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

              {/* Attribution Cleanup List (Needs Review) */}
              {leads.some(l => l.source_confidence === 'Needs Review') && (
                <div className="bg-rose-950/20 border border-rose-500/30 p-6 rounded-2xl">
                  <h2 className="text-sm font-mono tracking-widest text-rose-400 uppercase mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-rose-400" />
                    Attribution Cleanup List (Needs Review)
                  </h2>
                  <p className="text-xs text-rose-200/70 mb-4">
                    The following leads have conflicting acquisition sources (e.g. user selected one option while URL UTM tags or referral codes indicate another). Review the details and input a manually verified source.
                  </p>
                  
                  <div className="space-y-4">
                    {leads.filter(l => l.source_confidence === 'Needs Review').map((lead) => {
                      const calculatedDefault = lead.referral_code 
                        ? `Referral: ${lead.referral_partner_name || lead.referral_code}` 
                        : lead.utm_source 
                          ? `UTM: ${lead.utm_source}` 
                          : lead.how_heard || 'Website';

                      const currentVal = manualVerifiedValues[lead.id] !== undefined ? manualVerifiedValues[lead.id] : calculatedDefault;

                      return (
                        <div key={lead.id} className="bg-black/50 border border-rose-900/30 p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-6 text-sm">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">{lead.first_name} {lead.last_name || ''}</span>
                              <span className="text-xs text-white/50">({lead.email})</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-1 text-xs text-white/60">
                              <div><strong className="text-rose-400/80">User Selected:</strong> {lead.how_heard || 'None'} {lead.how_heard_other ? `(${lead.how_heard_other})` : ''}</div>
                              <div><strong className="text-rose-400/80">Referral Code:</strong> {lead.referral_code || 'None'} {lead.referral_partner_name ? `(${lead.referral_partner_name})` : ''}</div>
                              <div><strong className="text-rose-400/80">UTM Source:</strong> {lead.utm_source || 'None'}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <input 
                              type="text"
                              placeholder="Verified Source Name"
                              value={currentVal}
                              onChange={(e) => setManualVerifiedValues(prev => ({ ...prev, [lead.id]: e.target.value }))}
                              className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[var(--color-ares-teal)] text-white w-48 sm:w-60"
                            />
                            <button
                              onClick={async () => {
                                let val = manualVerifiedValues[lead.id];
                                if (val === undefined) val = calculatedDefault;
                                if (!val.trim()) {
                                  alert("Please enter a verified source channel name.");
                                  return;
                                }
                                setVerifyingLeadId(lead.id);
                                try {
                                  const res = await fetch(`/api/leads/${lead.id}/attribution`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ manuallyVerifiedSource: val.trim() })
                                  });
                                  if (res.ok) {
                                    alert("Attribution source verified successfully!");
                                    fetchLeadsAndAnalytics();
                                  } else {
                                    const err = await res.json();
                                    alert(`Failed: ${err.error}`);
                                  }
                                } catch (e) {
                                  console.error(e);
                                  alert("An error occurred during verification.");
                                } finally {
                                  setVerifyingLeadId(null);
                                }
                              }}
                              disabled={verifyingLeadId === lead.id}
                              className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-bold px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-colors shrink-0"
                            >
                              Verify
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Funnel Leads Table */}
              <div className="bg-black/30 border border-white/10 p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xs font-mono tracking-widest text-white/50 uppercase">All Leads & Assessment Results</h2>
                  <span className="text-xs font-mono text-white/40">Total Leads: {filteredLeads.length}</span>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[1000px]">
                    <thead>
                      <tr className="border-b border-white/10 text-[10px] font-mono text-white/40 uppercase">
                        <th className="pb-4">Lead Name</th>
                        <th className="pb-4">Athlete Details</th>
                        <th className="pb-4">Contact Info</th>
                        <th className="pb-4">Sport & Age</th>
                        <th className="pb-4 text-center">Score</th>
                        <th className="pb-4">Campaign Source</th>
                        <th className="pb-4">Current Status</th>
                        <th className="pb-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredLeads.length === 0 ? (
                        <tr><td colSpan={8} className="py-8 text-center text-sm text-white/20">No matching leads in record</td></tr>
                      ) : (
                        filteredLeads.map((lead) => {
                          const isUpdating = updatingLeadId === lead.id;
                          
                          return (
                            <tr key={lead.id} className="text-sm hover:bg-white/[0.02] transition-colors">
              {/* Lead Name */}
                              <td className="py-4 font-semibold text-white">
                                {lead.first_name} {lead.last_name || ''}
                                <span className="text-[10px] text-white/30 block font-mono">Date: {new Date(lead.created_at).toLocaleDateString()}</span>
                                {lead.lead_owner && (
                                  <span className="text-[10px] text-amber-400 block font-mono">Owner: {lead.lead_owner}</span>
                                )}
                                {lead.notes && (
                                  <span className="text-[10px] text-white/40 block max-w-[150px] truncate" title={lead.notes}>Notes: {lead.notes}</span>
                                )}
                              </td>
                              
                              {/* Athlete Details */}
                              <td className="py-4">
                                {lead.athlete_name ? (
                                  <div>
                                    <span className="text-white/80 font-bold block">{lead.athlete_name}</span>
                                    {lead.parent_guardian_name && (
                                      <span className="text-[10px] text-white/40 block">Parent: {lead.parent_guardian_name}</span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-white/30 italic text-xs">Self</span>
                                )}
                              </td>

                              {/* Contact Info */}
                              <td className="py-4">
                                <a href={`mailto:${lead.email}`} className="text-[var(--color-ares-teal)] hover:underline block truncate max-w-[180px]">{lead.email}</a>
                                {lead.phone && <span className="text-xs text-white/50 block font-mono">{lead.phone}</span>}
                              </td>

                              {/* Sport & Age */}
                              <td className="py-4">
                                <span className="text-white/80 block">{lead.sport || 'N/A'}</span>
                                {lead.age && <span className="text-xs text-white/40 block">Age: {lead.age}</span>}
                              </td>

                              {/* Symptom Score */}
                              <td className="py-4 text-center">
                                {lead.questionnaire_score !== null ? (
                                  <span className={`font-mono font-bold text-sm px-2.5 py-1 rounded-md ${
                                    lead.questionnaire_score >= 120 
                                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' 
                                      : lead.questionnaire_score >= 60 
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  }`}>
                                    {lead.questionnaire_score}
                                  </span>
                                ) : (
                                  <span className="text-white/20">-</span>
                                )}
                              </td>

                              {/* Campaign Source */}
                              <td className="py-4">
                                <span className="text-white/80 block font-medium">
                                  {lead.manually_verified_source || lead.last_touch_source || lead.lead_source || 'Website'}
                                </span>
                                <span className="text-[10px] text-white/40 block">
                                  Touch: {lead.first_touch_source || 'N/A'} (1st) / {lead.last_touch_source || 'N/A'} (Last)
                                </span>
                                {lead.referral_code && (
                                  <span className="text-[10px] text-[var(--color-ares-teal)] block font-medium">
                                    Ref: {lead.referral_code} {lead.referral_partner_name ? `(${lead.referral_partner_name})` : ''}
                                  </span>
                                )}
                                <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold inline-block mt-1 ${
                                  lead.source_confidence === 'High' 
                                    ? 'bg-emerald-500/10 text-emerald-400' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                }`}>
                                  {lead.source_confidence} Confidence
                                </span>
                              </td>

                              {/* Current Status */}
                              <td className="py-4">
                                <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block ${
                                  lead.status === 'Evaluation Scheduled' 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                    : lead.status === 'Became Client'
                                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                      : lead.status === 'Unsubscribed' || lead.status === 'Not Interested'
                                        ? 'bg-white/5 text-white/40 border border-white/10'
                                        : 'bg-[var(--color-ares-purple)]/10 text-[var(--color-ares-purple)] border border-[var(--color-ares-purple)]/20'
                                }`}>
                                  {lead.status}
                                </span>
                              </td>

                              {/* Actions Dropdown */}
                              <td className="py-4 text-right">
                                <div className="inline-flex items-center gap-2">
                                  {isUpdating && <div className="w-4.5 h-4.5 border-2 border-[var(--color-ares-teal)] border-t-transparent animate-spin rounded-full shrink-0" />}
                                  <select 
                                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                    value={lead.status}
                                    disabled={isUpdating}
                                    className="text-xs bg-black border border-white/10 rounded px-2 py-1 focus:outline-none focus:border-[var(--color-ares-teal)] cursor-pointer text-white/80 disabled:opacity-50"
                                  >
                                    {leadStatuses.map(status => (
                                      <option key={status} value={status}>{status}</option>
                                    ))}
                                  </select>
                                </div>
                              </td>

                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )
        )}

        {/* Webhook integration footer note */}
        <div className="mt-8 p-4 bg-black/30 border border-white/10 rounded-xl max-w-3xl">
           <h4 className="text-sm font-bold flex items-center gap-2 mb-2 uppercase tracking-wide text-white/90">
             <DollarSign className="w-4 h-4 text-emerald-400" />
             Automation Webhook & Suppression Note
           </h4>
           <p className="text-xs text-white/50 leading-relaxed">
             This Operations Board integrates real-time SQL analytics triggers. When a Stripe checkout payment is received or status is manually updated, nurture sequences are instantly paused/completed to maintain a high-quality user experience.
           </p>
        </div>

      </div>
    </div>
  );
}
