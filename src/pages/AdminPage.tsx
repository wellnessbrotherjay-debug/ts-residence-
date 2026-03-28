import { X } from 'lucide-react';
import { useState, useEffect, FormEvent } from 'react';
import { BTN_SOLID } from '../constants';
import type { DBImage } from '../types';

export const AdminPage = () => {
  const [images, setImages] = useState<DBImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [category, setCategory] = useState('general');
  const [alt, setAlt] = useState('');
  const [editingImage, setEditingImage] = useState<DBImage | null>(null);

  const fetchImages = async () => {
    const res = await fetch('/api/images');
    setImages(await res.json());
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const resetForm = () => {
    setSelectedFile(null);
    setCategory('general');
    setAlt('');
    setEditingImage(null);
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();
    setUploading(true);
    const formData = new FormData();
    if (selectedFile) formData.append('image', selectedFile);
    formData.append('category', category);
    formData.append('alt', alt);
    try {
      const url = editingImage
        ? `/api/images/${editingImage.id}`
        : '/api/images';
      const res = await fetch(url, {
        method: editingImage ? 'PUT' : 'POST',
        body: formData,
      });
      if (res.ok) {
        resetForm();
        fetchImages();
      }
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this image?')) return;
    try {
      const res = await fetch(`/api/images/${id}`, { method: 'DELETE' });
      if (res.ok) fetchImages();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="pt-32 pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <h1 className="heading-display text-4xl text-ink mb-10">
        Image Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 bg-white p-8 border border-border h-fit">
          <h2 className="text-lg font-semibold mb-6">
            {editingImage ? 'Edit Image' : 'Upload New Image'}
          </h2>
          {editingImage && (
            <div className="mb-4 aspect-video overflow-hidden border border-border">
              <img
                src={editingImage.url}
                alt={editingImage.alt}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <form onSubmit={handleUpload} className="space-y-6">
            <div className="space-y-2">
              <label className="label-caps">
                File {editingImage && '(optional)'}
              </label>
              <input
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="w-full text-sm"
                accept="image/*"
              />
            </div>
            <div className="space-y-2">
              <label className="label-caps">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full border-b border-border py-2 outline-none focus:border-gold bg-transparent"
              >
                <option value="hero">Hero Section</option>
                <option value="residence">Gallery: TS Residence</option>
                <option value="suites">Gallery: TS Suites</option>
                <option value="social">Gallery: TS Social Club</option>
                <option value="wellness">Gallery: No.1 Wellness Club</option>
                <option value="offers">Offers</option>
                <option value="solo">Apartment: SOLO</option>
                <option value="studio">Apartment: STUDIO</option>
                <option value="soho">Apartment: SOHO</option>
                <option value="apartments">Apartments (Other)</option>
                <option value="general">General</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="label-caps">Alt Text / Title</label>
              <input
                type="text"
                value={alt}
                onChange={(e) => setAlt(e.target.value)}
                placeholder="Describe the image"
                className="w-full border-b border-border py-2 outline-none focus:border-gold bg-transparent text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={uploading || (!selectedFile && !editingImage)}
                className={`${BTN_SOLID} flex-1 disabled:opacity-50`}
              >
                {uploading ? 'Saving...' : editingImage ? 'Update' : 'Upload'}
              </button>
              {editingImage && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-3 border border-border text-sm hover:bg-cream transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-lg font-semibold">
            Stored Images ({images.length})
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img) => (
              <div
                key={img.id}
                onClick={() => {
                  setEditingImage(img);
                  setCategory(img.category);
                  setAlt(img.alt);
                  setSelectedFile(null);
                }}
                className="group relative aspect-square overflow-hidden border border-border bg-cream cursor-pointer hover:ring-2 hover:ring-gold transition-all"
              >
                <img
                  src={img.url}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-4">
                  <p className="text-white label-caps mb-1">{img.category}</p>
                  <p className="text-white/60 text-[9px] mb-3">Click to edit</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(img.id);
                    }}
                    className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
