import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '@/services/api';
import Button from '../../components/ui/Button';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showOnHome, setShowOnHome] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchFaqs = () => {
    setLoading(true);
    api.get('/admin/faqs')
      .then((res) => {
        if (res.data?.data) setFaqs(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error loading FAQs');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleOpenAdd = () => {
    setEditingFaq(null);
    setQuestion('');
    setAnswer('');
    setShowOnHome(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (faq) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setShowOnHome(Boolean(faq.showOnHome));
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingFaq) {
        await api.put(`/admin/faqs/${editingFaq._id}`, { question, answer, showOnHome });
        toast.success('FAQ updated successfully');
      } else {
        await api.post('/admin/faqs', { question, answer, showOnHome });
        toast.success('FAQ created successfully');
      }
      setIsModalOpen(false);
      fetchFaqs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save FAQ');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this question?')) return;
    try {
      await api.delete(`/admin/faqs/${id}`);
      toast.success('FAQ deleted');
      fetchFaqs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete FAQ');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-cocoa">
            Manage FAQs
          </h1>
          <p className="text-cocoa/70 text-sm">
            Add or edit questions displayed on the website FAQ page and Homepage FAQ preview.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd}>
          + Add New FAQ
        </Button>
      </div>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div
            key={faq._id}
            className="rounded-3xl bg-white border border-cocoa/10 p-5 sm:p-6 shadow-card space-y-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-display text-lg font-medium text-cocoa">
                    {faq.question}
                  </h3>
                  {faq.showOnHome && (
                    <span className="px-2 py-0.5 rounded-full bg-honey text-cocoa text-[10px] font-bold uppercase">
                      Home
                    </span>
                  )}
                </div>
                <p className="text-sm text-cocoa/75 leading-relaxed">
                  {faq.answer}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(faq)}
                  className="px-3 py-1 rounded-xl bg-sand/60 hover:bg-sand text-cocoa text-xs font-semibold"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(faq._id)}
                  className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-cocoa/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-float">
            <div className="flex items-center justify-between border-b border-cocoa/10 pb-3">
              <h3 className="font-display text-2xl font-medium text-cocoa">
                {editingFaq ? 'Edit FAQ' : 'Add New FAQ'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-sand/60 hover:bg-sand text-cocoa flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Question *</label>
                <input
                  type="text"
                  required
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Can we visit the showroom in Dubai?"
                  className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Answer *</label>
                <textarea
                  rows={4}
                  required
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="e.g. Yes! We are located in Downtown Dubai and welcome private family visits..."
                  className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-cocoa font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnHome}
                  onChange={(e) => setShowOnHome(e.target.checked)}
                  className="size-4 rounded"
                />
                Show on Homepage FAQ preview
              </label>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
