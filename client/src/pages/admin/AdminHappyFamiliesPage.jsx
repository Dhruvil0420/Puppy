import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import Button from '../../components/ui/Button';
import ImageUploader from '../../components/admin/ImageUploader';

export default function AdminHappyFamiliesPage() {
  const [families, setFamilies] = useState([]);
  const [loading, setLoading] = useState(true);

  // Add State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  const fetchFamilies = () => {
    setLoading(true);
    api.get('/admin/happy-families?limit=50')
      .then((res) => {
        if (res.data?.data) setFamilies(res.data.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error loading happy families');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('images', file);

    setUploading(true);
    try {
      const res = await api.post('/admin/upload/images', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data?.data?.[0]?.url) {
        setUploadedUrl(res.data.data[0].url);
        toast.success('Photo uploaded');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!uploadedUrl) {
      toast.error('Please upload a photo first');
      return;
    }

    try {
      await api.post('/admin/happy-families', {
        imageUrl: uploadedUrl,
        caption,
      });
      toast.success('Happy family moment added!');
      setIsModalOpen(false);
      setCaption('');
      setUploadedUrl('');
      fetchFamilies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await api.delete(`/admin/happy-families/${id}`);
      toast.success('Photo deleted');
      fetchFamilies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-medium text-cocoa">
            Happy Families Gallery
          </h1>
          <p className="text-cocoa/70 text-sm">
            Manage photos of adopted puppies with their forever families in Dubai and the Gulf.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={() => setIsModalOpen(true)}>
          + Add Family Moment
        </Button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {families.map((f) => (
          <div key={f._id} className="group relative aspect-square rounded-3xl overflow-hidden bg-white border border-cocoa/10 shadow-card">
            <img src={f.imageUrl} alt="" className="size-full object-cover" />
            <div className="absolute inset-0 bg-cocoa/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3 text-cream">
              <p className="text-xs line-clamp-3">{f.caption || 'No caption'}</p>
              <button
                type="button"
                onClick={() => handleDelete(f._id)}
                className="self-end px-3 py-1 rounded-xl bg-rose-600 text-white text-xs font-semibold hover:bg-rose-700 cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-cocoa/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 shadow-float">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-medium text-cocoa">
                Add Family Moment
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="size-8 rounded-full bg-sand/60 hover:bg-sand text-cocoa flex items-center justify-center font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Upload Photo *</label>
                <ImageUploader
                  value={uploadedUrl ? [{ url: uploadedUrl }] : []}
                  sub="families"
                  max={1}
                  onChange={(newList) => {
                    const first = newList[0];
                    setUploadedUrl(first ? (typeof first === 'string' ? first : first.url) : '');
                  }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-cocoa/70 mb-1">Caption / Story</label>
                <input
                  type="text"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="e.g. Leo welcoming home his new best friend in Downtown Dubai"
                  className="w-full px-3 py-2 rounded-xl border border-cocoa/15 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={uploading || !uploadedUrl}>
                  Save Photo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
