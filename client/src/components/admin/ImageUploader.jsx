import React, { useState } from 'react';
import { uploadImages } from '../../api/upload';

export default function ImageUploader({
  value = [], // Array of URLs or objects { url, publicId }
  onChange,   // (newArray) => void
  sub = 'puppies',
  max = 8,
}) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorText, setErrorText] = useState('');

  const normalizeList = value.map((item) => {
    if (typeof item === 'string') return { url: item, publicId: '' };
    return item;
  });

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setErrorText('');

    // Check count limit
    if (normalizeList.length + files.length > max) {
      setErrorText(`You can only upload up to ${max} images in total.`);
      return;
    }

    // Client checks: formats & size <= 5MB
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];
    for (const f of files) {
      if (!allowed.includes(f.type)) {
        setErrorText(`File "${f.name}" has an unsupported format. Use JPEG, PNG, WEBP, or AVIF.`);
        return;
      }
      if (f.size > 5 * 1024 * 1024) {
        setErrorText(`File "${f.name}" exceeds the 5MB limit.`);
        return;
      }
    }

    setUploading(true);
    setProgress(0);

    try {
      const uploaded = await uploadImages(files, sub, (percent) => {
        setProgress(percent);
      });

      const updated = [
        ...normalizeList,
        ...uploaded.map((u) => ({ url: u.url, publicId: u.publicId })),
      ];

      onChange(updated);
    } catch (err) {
      setErrorText(err.response?.data?.message || err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
      setProgress(0);
      e.target.value = ''; // reset input
    }
  };

  const handleRemove = (index) => {
    const updated = normalizeList.filter((_, i) => i !== index);
    onChange(updated);
  };

  const moveLeft = (index) => {
    if (index === 0) return;
    const updated = [...normalizeList];
    const temp = updated[index - 1];
    updated[index - 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  const moveRight = (index) => {
    if (index === normalizeList.length - 1) return;
    const updated = [...normalizeList];
    const temp = updated[index + 1];
    updated[index + 1] = updated[index];
    updated[index] = temp;
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      {/* Upload button area */}
      <div className="flex items-center gap-3">
        <label className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sand/60 hover:bg-sand border border-cocoa/15 text-xs font-semibold text-cocoa cursor-pointer transition-colors shadow-soft">
          <span>📁</span>
          <span>{uploading ? `Uploading (${progress}%)...` : 'Choose Images'}</span>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={handleFiles}
            disabled={uploading || normalizeList.length >= max}
            className="hidden"
          />
        </label>

        <span className="text-xs text-cocoa/50">
          {normalizeList.length} / {max} images (JPEG/PNG/WEBP/AVIF &le; 5MB)
        </span>
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="w-full bg-sand/40 rounded-full h-2 overflow-hidden">
          <div
            className="bg-apricot h-2 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Error Message */}
      {errorText && (
        <p className="text-xs text-rose-500 font-semibold">{errorText}</p>
      )}

      {/* Thumbnails Grid */}
      {normalizeList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
          {normalizeList.map((item, index) => (
            <div
              key={item.url + index}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-cocoa/15 bg-honey/20 shadow-soft"
            >
              <img src={item.url} alt="" className="size-full object-cover" />

              {/* Cover badge on first image */}
              {index === 0 && (
                <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-full bg-cocoa text-cream text-[10px] font-bold shadow-soft">
                  Cover
                </div>
              )}

              {/* Actions bar (Remove & Reorder) */}
              <div className="absolute inset-x-0 bottom-0 p-1.5 bg-gradient-to-t from-cocoa/80 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs">
                <div className="flex gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveLeft(index)}
                      className="size-6 rounded-md bg-cocoa/70 hover:bg-cocoa flex items-center justify-center font-bold"
                      title="Move left"
                    >
                      ‹
                    </button>
                  )}
                  {index < normalizeList.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveRight(index)}
                      className="size-6 rounded-md bg-cocoa/70 hover:bg-cocoa flex items-center justify-center font-bold"
                      title="Move right"
                    >
                      ›
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="size-6 rounded-md bg-rose-600 hover:bg-rose-700 flex items-center justify-center font-bold text-white shadow-sm"
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
