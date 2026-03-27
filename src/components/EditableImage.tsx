import { useState, useRef } from 'react';

export const EditableImage = ({
  src,
  alt,
  category,
  className,
  onImageChange,
  children
}: {
  src: string;
  alt: string;
  category: string;
  className?: string;
  onImageChange?: (newUrl: string) => void;
  children?: any;
}) => {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('category', category);
    formData.append('alt', alt);
    try {
      const res = await fetch('/api/images', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        onImageChange?.(data.url);
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={`relative group ${className || ''}`}>
      {typeof children === 'function' ? children(src) : children ? children : (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      )}
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute top-4 right-4 z-10 bg-white/90 hover:bg-white text-ink p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 disabled:opacity-50"
        disabled={uploading}
        title="Replace image"
      >
        {uploading ? '...' : (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f); }}
        className="hidden"
      />
    </div>
  );
};
