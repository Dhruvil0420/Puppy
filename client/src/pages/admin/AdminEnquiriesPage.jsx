import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import Button from '../../components/ui/Button';
import { buildWhatsAppLink } from '../../utils/whatsapp';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  // Detail Drawer State
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [adminNote, setAdminNote] = useState('');
  const [currentStatus, setCurrentStatus] = useState('new');
  const [updating, setUpdating] = useState(false);

  const fetchEnquiries = () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (statusFilter) q.set('status', statusFilter);
    if (sourceFilter) q.set('source', sourceFilter);
    q.set('page', page);
    q.set('limit', '15');

    api.get(`/admin/enquiries?${q.toString()}`)
      .then((res) => {
        if (res.data?.data) {
          setEnquiries(res.data.data);
          if (res.data.meta) setMeta(res.data.meta);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error loading enquiries');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEnquiries();
  }, [page, statusFilter, sourceFilter]);

  const handleOpenDrawer = (enq) => {
    setSelectedEnquiry(enq);
    setAdminNote(enq.adminNote || '');
    setCurrentStatus(enq.status || 'new');
    setDrawerOpen(true);
  };

  const handleSaveStatusAndNote = async () => {
    if (!selectedEnquiry) return;
    setUpdating(true);
    try {
      const res = await api.patch(`/admin/enquiries/${selectedEnquiry._id}`, {
        status: currentStatus,
        adminNote,
      });
      toast.success('Enquiry updated successfully');
      setSelectedEnquiry(res.data?.data);
      fetchEnquiries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update enquiry');
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteEnquiry = async (id) => {
    if (!window.confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      await api.delete(`/admin/enquiries/${id}`);
      toast.success('Enquiry deleted');
      if (selectedEnquiry?._id === id) setDrawerOpen(false);
      fetchEnquiries();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete enquiry');
    }
  };

  const handleExportCsv = async () => {
    try {
      const res = await api.get('/admin/enquiries/export.csv', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('CSV export downloaded');
    } catch (err) {
      toast.error('Failed to export CSV');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-cocoa">
            Enquiries
          </h1>
          <p className="text-cocoa/70 text-sm">
            Review customer messages, update follow-up statuses, and chat on WhatsApp.
          </p>
        </div>

        <Button variant="secondary" size="md" onClick={handleExportCsv}>
          <span>📥</span>
          <span>Export CSV</span>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 rounded-2xl border border-cocoa/15 bg-white text-xs font-semibold outline-none cursor-pointer"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => {
            setSourceFilter(e.target.value);
            setPage(1);
          }}
          className="px-3.5 py-2 rounded-2xl border border-cocoa/15 bg-white text-xs font-semibold outline-none cursor-pointer"
        >
          <option value="">All sources</option>
          <option value="contact">Contact letter</option>
          <option value="puppy">Puppy detail</option>
        </select>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-cocoa/10 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sand/30 border-b border-cocoa/10 text-cocoa/60 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Interest</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Received</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/5">
              {enquiries.map((enq) => (
                <tr
                  key={enq._id}
                  onClick={() => handleOpenDrawer(enq)}
                  className="hover:bg-sand/15 cursor-pointer"
                >
                  <td className="p-4">
                    <strong className="text-cocoa font-semibold block">{enq.name}</strong>
                    {enq.area && <span className="text-[11px] text-cocoa/50">{enq.area}</span>}
                  </td>
                  <td className="p-4">
                    <span className="block text-cocoa">{enq.phone}</span>
                    {enq.email && <span className="text-[11px] text-cocoa/60">{enq.email}</span>}
                  </td>
                  <td className="p-4">
                    {enq.puppy ? (
                      <span className="font-semibold text-apricot-dark">{enq.puppy.name}</span>
                    ) : (
                      <span className="capitalize text-cocoa/70">{enq.source} form</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      enq.status === 'new' ? 'bg-amber-100 text-amber-800' :
                      enq.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                      'bg-emerald-100 text-emerald-800'
                    }`}>
                      {enq.status}
                    </span>
                  </td>
                  <td className="p-4 text-right text-xs text-cocoa/60">
                    {new Date(enq.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleDeleteEnquiry(enq._id)}
                      className="px-2.5 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {meta.pages > 1 && (
          <div className="p-4 border-t border-cocoa/10 flex items-center justify-between text-xs text-cocoa/70">
            <span>Page {meta.page} of {meta.pages} ({meta.total} enquiries)</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-xl border border-cocoa/15 disabled:opacity-40"
              >
                ‹ Prev
              </button>
              <button
                type="button"
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-xl border border-cocoa/15 disabled:opacity-40"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Slideover Drawer */}
      {drawerOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 bg-cocoa/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto animate-slide-left">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-cocoa/10 pb-4">
                <h3 className="font-display text-2xl font-medium text-cocoa">
                  Enquiry Details
                </h3>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="size-8 rounded-full bg-sand/60 hover:bg-sand text-cocoa flex items-center justify-center font-bold text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Customer Info Card */}
              <div className="rounded-2xl bg-sand/30 p-4 space-y-2 text-xs sm:text-sm">
                <div>
                  <span className="text-cocoa/50 font-bold uppercase text-[10px]">Name</span>
                  <p className="font-semibold text-cocoa text-base">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <span className="text-cocoa/50 font-bold uppercase text-[10px]">Phone / WhatsApp</span>
                  <p className="font-mono text-cocoa">{selectedEnquiry.phone}</p>
                </div>
                {selectedEnquiry.email && (
                  <div>
                    <span className="text-cocoa/50 font-bold uppercase text-[10px]">Email</span>
                    <p className="text-cocoa">{selectedEnquiry.email}</p>
                  </div>
                )}
                {selectedEnquiry.area && (
                  <div>
                    <span className="text-cocoa/50 font-bold uppercase text-[10px]">Area</span>
                    <p className="text-cocoa">{selectedEnquiry.area}</p>
                  </div>
                )}
              </div>

              {/* Message */}
              {selectedEnquiry.message && (
                <div className="space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-cocoa/60">Customer Message</span>
                  <div className="p-4 rounded-2xl bg-cream border border-cocoa/10 text-sm text-cocoa whitespace-pre-wrap">
                    {selectedEnquiry.message}
                  </div>
                </div>
              )}

              {/* Reply on WhatsApp Button */}
              <div>
                <a
                  href={buildWhatsAppLink(
                    `Hi ${selectedEnquiry.name}! Thank you for reaching out to TeddyPups U.A.E. regarding your puppy enquiry. How may we assist you today?`,
                    selectedEnquiry.phone
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 h-11 rounded-2xl bg-[#25D366] text-white font-semibold text-sm shadow-soft hover:bg-[#20bd5a] transition-colors"
                >
                  <span>💬</span>
                  <span>Reply to {selectedEnquiry.name} on WhatsApp</span>
                </a>
              </div>

              {/* Status & Admin Note */}
              <div className="space-y-4 pt-4 border-t border-cocoa/10">
                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
                    Enquiry Status
                  </label>
                  <select
                    value={currentStatus}
                    onChange={(e) => setCurrentStatus(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 bg-white text-sm outline-none"
                  >
                    <option value="new">New (Needs attention)</option>
                    <option value="contacted">Contacted (In conversation)</option>
                    <option value="closed">Closed (Adopted / resolved)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">
                    Internal Admin Note
                  </label>
                  <textarea
                    rows={3}
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="e.g. Sent photos on WhatsApp, visiting showroom Saturday at 4 PM"
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 bg-white text-sm outline-none resize-none"
                  />
                </div>

                <Button
                  variant="primary"
                  size="md"
                  disabled={updating}
                  onClick={handleSaveStatusAndNote}
                  className="w-full"
                >
                  {updating ? 'Saving updates...' : 'Save Status & Note'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
