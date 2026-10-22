import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import ImageUploader from '../../components/admin/ImageUploader';
import VideoField from '../../components/admin/VideoField';

export default function AdminPuppiesPage() {

  const [puppies, setPuppies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPuppy, setEditingPuppy] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    breed: 'Maltipoo',
    gender: 'female',
    age: '2 months',
    estimatedAdultWeight: '1.8 - 2.2 kg',
    origin: 'dubai',
    status: 'available',
    description: '',
    featured: false,
    showOnHome: true,
    primaryImage: '',
    photos: [],
    videoUrl: '',
    videoPublicId: '',
    videoPoster: '',
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [saving, setSaving] = useState(false);

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState(null);

  const fetchPuppies = () => {
    setLoading(true);
    const q = new URLSearchParams();
    if (search) q.set('q', search);
    q.set('page', page);
    q.set('limit', '10');

    api.get(`/admin/puppies?${q.toString()}`)
      .then((res) => {
        if (res.data?.data) {
          setPuppies(res.data.data);
          if (res.data.meta) setMeta(res.data.meta);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error loading puppies');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchPuppies();
  }, [page, search]);

  const handleOpenAdd = () => {
    setEditingPuppy(null);
    setFormData({
      name: '',
      breed: 'Maltipoo',
      gender: 'female',
      age: '2 months',
      estimatedAdultWeight: '1.8 - 2.2 kg',
      origin: 'dubai',
      status: 'available',
      description: '',
      featured: false,
      showOnHome: true,
      primaryImage: '',
      photos: [],
      videoUrl: '',
      videoPublicId: '',
      videoPoster: '',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPuppy(p);
    const resolvedPhotos =
      Array.isArray(p.photos) && p.photos.length > 0
        ? p.photos
        : Array.isArray(p.images)
        ? p.images.map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean)
        : [];

    setFormData({
      name: p.name,
      breed: p.breed,
      gender: p.gender,
      age: p.age || '',
      estimatedAdultWeight: p.estimatedAdultWeight || '',
      origin: p.origin || 'dubai',
      status: p.status || 'available',
      description: p.description || '',
      featured: Boolean(p.featured),
      showOnHome: Boolean(p.showOnHome),
      primaryImage: p.primaryImage || resolvedPhotos[0] || '',
      photos: resolvedPhotos,
      videoUrl: p.videoUrl || '',
      videoPublicId: p.videoPublicId || '',
      videoPoster: p.videoPoster || '',
    });
    setIsModalOpen(true);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`/admin/puppies/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchPuppies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deletingId) return;
    try {
      await api.delete(`/admin/puppies/${deletingId}`);
      toast.success('Puppy deleted successfully');
      setDeletingId(null);
      fetchPuppies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete puppy');
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('images', files[i]);
    }

    setUploadingImage(true);
    try {
      const res = await api.post('/admin/upload/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data) {
        const newUrls = res.data.data.map((item) => item.url);
        setFormData((prev) => ({
          ...prev,
          primaryImage: prev.primaryImage || newUrls[0],
          photos: [...prev.photos, ...newUrls],
        }));
        toast.success(`${newUrls.length} image(s) uploaded`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('video', file);

    setUploadingVideo(true);
    try {
      const res = await api.post('/admin/upload/video', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data?.url) {
        setFormData((prev) => ({ ...prev, videoUrl: res.data.data.url }));
        toast.success('Video uploaded successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Video upload failed');
    } finally {
      setUploadingVideo(false);
    }
  };

  const handleRemovePhoto = (idx) => {
    setFormData((prev) => {
      const updated = prev.photos.filter((_, i) => i !== idx);
      return {
        ...prev,
        photos: updated,
        primaryImage: prev.primaryImage === prev.photos[idx] ? (updated[0] || '') : prev.primaryImage,
      };
    });
  };

  const handleSavePuppy = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingPuppy) {
        await api.put(`/admin/puppies/${editingPuppy._id}`, formData);
        toast.success('Puppy updated successfully');
      } else {
        await api.post('/admin/puppies', formData);
        toast.success('Puppy created successfully');
      }
      setIsModalOpen(false);
      fetchPuppies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save puppy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-cocoa">
            Manage Puppies
          </h1>
          <p className="text-cocoa/70 text-sm">
            Add new showroom or imported puppies, upload videos, and update adoption statuses.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd}>
          + Add New Puppy
        </Button>
      </div>

      {/* Search Input */}
      <div className="max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name, breed, or color..."
          className="w-full px-4 py-2.5 rounded-2xl border border-cocoa/15 bg-white text-sm outline-none focus:border-cocoa"
        />
      </div>

      {/* Puppies Table */}
      <div className="rounded-3xl bg-white border border-cocoa/10 overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-sand/30 border-b border-cocoa/10 text-cocoa/60 uppercase text-[11px] font-bold">
              <tr>
                <th className="p-4">Puppy</th>
                <th className="p-4">Breed & Gender</th>
                <th className="p-4">Origin</th>
                <th className="p-4">Status</th>
                <th className="p-4">Featured</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cocoa/5">
              {puppies.map((p) => (
                <tr key={p._id} className="hover:bg-sand/10">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-xl overflow-hidden bg-honey/30 shrink-0 border border-cocoa/10">
                        <img
                          src={p.primaryImage || p.photos?.[0] || ''}
                          alt={p.name}
                          className="size-full object-cover"
                        />
                      </div>
                      <div>
                        <strong className="font-display text-base text-cocoa block">{p.name}</strong>
                        <span className="text-[11px] text-cocoa/50 font-mono">/{p.slug}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-cocoa block">{p.breed}</span>
                    <span className="text-xs text-cocoa/60 capitalize">{p.gender}</span>
                  </td>
                  <td className="p-4">
                    <span className="capitalize text-xs font-semibold px-2.5 py-1 rounded-full bg-sand/60 text-cocoa">
                      {p.origin}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={p.status}
                      onChange={(e) => handleStatusChange(p._id, e.target.value)}
                      className="px-2.5 py-1 rounded-xl border border-cocoa/15 text-xs font-semibold bg-white outline-none cursor-pointer"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="gone-home">Gone Home</option>
                    </select>
                  </td>
                  <td className="p-4">
                    {p.featured ? (
                      <span className="text-emerald-600 font-bold text-xs">★ Yes</span>
                    ) : (
                      <span className="text-cocoa/30 text-xs">No</span>
                    )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="px-3 py-1 rounded-xl bg-sand/60 hover:bg-sand text-cocoa text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingId(p._id)}
                      className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold transition-colors cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {meta.pages > 1 && (
          <div className="p-4 border-t border-cocoa/10 flex items-center justify-between text-xs text-cocoa/70">
            <span>
              Page {meta.page} of {meta.pages} ({meta.total} puppies)
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 rounded-xl border border-cocoa/15 disabled:opacity-40 cursor-pointer"
              >
                ‹ Prev
              </button>
              <button
                type="button"
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 rounded-xl border border-cocoa/15 disabled:opacity-40 cursor-pointer"
              >
                Next ›
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-cocoa/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-float my-8 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-cocoa/10 pb-4">
              <h2 className="font-display text-2xl font-medium text-cocoa">
                {editingPuppy ? `Edit ${editingPuppy.name}` : 'Add New Puppy'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-sand/60 hover:bg-sand text-cocoa flex items-center justify-center font-bold text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSavePuppy} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Breed *</label>
                  <input
                    type="text"
                    required
                    value={formData.breed}
                    onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm bg-white"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Origin *</label>
                  <select
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm bg-white"
                  >
                    <option value="dubai">In Dubai showroom</option>
                    <option value="imported">Imported</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm bg-white"
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="gone-home">Gone Home</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Age</label>
                  <input
                    type="text"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                    placeholder="e.g. 2 months"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Est. Adult Weight</label>
                  <input
                    type="text"
                    value={formData.estimatedAdultWeight}
                    onChange={(e) => setFormData({ ...formData, estimatedAdultWeight: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                    placeholder="e.g. 1.8 - 2.2 kg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                />
              </div>

              {/* Photo Upload Section using ImageUploader */}
              <div className="space-y-2 pt-2 border-t border-cocoa/10">
                <label className="block text-xs font-bold uppercase text-cocoa/70">
                  Puppy Photos (Max 8 images, first is Cover)
                </label>
                <ImageUploader
                  value={formData.photos}
                  sub="puppies"
                  max={8}
                  onChange={(newList) => {
                    const urls = newList.map((item) => (typeof item === 'string' ? item : item.url));
                    setFormData((prev) => ({
                      ...prev,
                      primaryImage: urls[0] || '',
                      photos: urls,
                    }));
                  }}
                />
              </div>

              {/* Video Upload Section using VideoField */}
              <div className="pt-2 border-t border-cocoa/10">
                <VideoField
                  videoUrl={formData.videoUrl}
                  videoPublicId={formData.videoPublicId}
                  videoPoster={formData.videoPoster}
                  onChange={({ videoUrl, videoPublicId, videoPoster }) => {
                    setFormData((prev) => ({
                      ...prev,
                      videoUrl,
                      videoPublicId,
                      videoPoster,
                    }));
                  }}
                />
              </div>

              {/* Checkboxes: Featured & ShowOnHome */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 text-sm text-cocoa font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="size-4 rounded"
                  />
                  Featured in hero slideshow
                </label>

                <label className="flex items-center gap-2 text-sm text-cocoa font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnHome}
                    onChange={(e) => setFormData({ ...formData, showOnHome: e.target.checked })}
                    className="size-4 rounded"
                  />
                  Show on Homepage
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-cocoa/10">
                <Button variant="ghost" size="md" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="md" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Puppy'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-cocoa/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-float">
            <span className="text-4xl text-rose-500">⚠️</span>
            <h3 className="font-display text-xl font-medium text-cocoa">Delete Puppy?</h3>
            <p className="text-xs text-cocoa/70">
              This action cannot be undone. Any uploaded photos and video for this puppy will be permanently removed.
            </p>
            <div className="flex justify-center gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setDeletingId(null)}>
                Cancel
              </Button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-5 py-2 rounded-full bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Delete permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
