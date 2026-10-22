import React, { useState } from 'react';
import { uploadVideo, uploadVideoFromUrl, deleteUpload } from '../../api/upload';

export default function VideoField({
  videoUrl = '',
  videoPublicId = '',
  videoPoster = '',
  onChange, // ({ videoUrl, videoPublicId, videoPoster }) => void
}) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' | 'url'
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState('');

  // 1. File Upload (Multer)
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErrorText('');

    if (!['video/mp4', 'video/webm'].includes(file.type)) {
      setErrorText('Only MP4 and WEBM video formats are supported.');
      return;
    }
    if (file.size > 30 * 1024 * 1024) {
      setErrorText('Video exceeds the 30MB size limit.');
      return;
    }

    setLoading(true);
    setProgress(0);

    try {
      const res = await uploadVideo(file, (percent) => setProgress(percent));
      if (res?.url) {
        const poster = res.url.replace(/\.[^/.]+$/, '.jpg');
        onChange({
          videoUrl: res.url,
          videoPublicId: res.publicId || '',
          videoPoster: poster,
        });
      }
    } catch (err) {
      setErrorText(err.response?.data?.message || 'Video file upload failed.');
    } finally {
      setLoading(false);
      setProgress(0);
      e.target.value = '';
    }
  };

  // 2. URL Fetch & Upload
  const handleUrlUpload = async (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setErrorText('');
    setLoading(true);

    try {
      const res = await uploadVideoFromUrl(urlInput.trim());
      if (res?.url) {
        onChange({
          videoUrl: res.url,
          videoPublicId: res.publicId || '',
          videoPoster: res.poster || res.url.replace(/\.[^/.]+$/, '.jpg'),
        });
        setUrlInput('');
      }
    } catch (err) {
      setErrorText(err.response?.data?.message || 'Failed to fetch video from URL.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Remove Video
  const handleRemove = async () => {
    if (videoPublicId) {
      try {
        await deleteUpload(videoPublicId, 'video');
      } catch (err) {
        console.warn('Could not delete video from Cloudinary:', err);
      }
    }
    onChange({ videoUrl: '', videoPublicId: '', videoPoster: '' });
  };

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase text-cocoa/70">
        Puppy Video (MP4/WEBM &le; 30MB, max 60s)
      </label>

      {/* Tabs */}
      {!videoUrl && (
        <div className="space-y-3">
          <div className="flex gap-2 border-b border-cocoa/10 pb-2">
            <button
              type="button"
              onClick={() => { setActiveTab('file'); setErrorText(''); }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'file' ? 'bg-cocoa text-cream shadow-soft' : 'text-cocoa/60 hover:text-cocoa'
              }`}
            >
              Upload file
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('url'); setErrorText(''); }}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'url' ? 'bg-cocoa text-cream shadow-soft' : 'text-cocoa/60 hover:text-cocoa'
              }`}
            >
              Paste URL
            </button>
          </div>

          {activeTab === 'file' ? (
            <div>
              <input
                type="file"
                accept="video/mp4,video/webm"
                onChange={handleFileUpload}
                disabled={loading}
                className="block text-xs text-cocoa/70"
              />
              {loading && (
                <div className="mt-2 space-y-1">
                  <div className="w-full bg-sand/40 rounded-full h-2 overflow-hidden">
                    <div className="bg-apricot h-2 transition-all duration-300" style={{ width: `${progress}%` }} />
                  </div>
                  <span className="text-[11px] text-cocoa/50">Uploading video ({progress}%)...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://example.com/puppy.mp4"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-xl border border-cocoa/15 bg-white text-xs outline-none focus:border-cocoa"
                />
                <button
                  type="button"
                  onClick={handleUrlUpload}
                  disabled={loading || !urlInput.trim()}
                  className="px-4 py-2 rounded-xl bg-cocoa text-cream text-xs font-semibold hover:bg-cocoa-light disabled:opacity-50 cursor-pointer shadow-soft shrink-0"
                >
                  {loading ? 'Fetching...' : 'Fetch & upload'}
                </button>
              </div>
              <p className="text-[11px] text-cocoa/50">
                Paste a direct .mp4 link, not a YouTube or page link.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {errorText && (
        <p className="text-xs text-rose-500 font-semibold">{errorText}</p>
      )}

      {/* Video Preview */}
      {videoUrl && (
        <div className="rounded-2xl border border-cocoa/15 bg-honey/15 p-3 space-y-3">
          <div className="aspect-video max-w-sm rounded-xl overflow-hidden bg-black shadow-soft">
            <video
              src={videoUrl}
              poster={videoPoster}
              controls
              playsInline
              preload="metadata"
              className="size-full object-contain"
            />
          </div>

          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
              <span>✓</span> Video attached
            </span>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-semibold cursor-pointer transition-colors"
            >
              Remove video
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
