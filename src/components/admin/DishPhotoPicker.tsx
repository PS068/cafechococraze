import { useState, useRef, useId } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Trash2,
  Link2,
  Check,
  X,
  Camera,
  RefreshCw,
} from 'lucide-react';
import { PHOTO_PRESETS, type PhotoPreset } from '../../data/foodPhotos';

interface DishPhotoPickerProps {
  value: string;
  onChange: (url: string) => void;
}

export default function DishPhotoPicker({ value, onChange }: DishPhotoPickerProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'upload' | 'url'>('presets');
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [urlInput, setUrlInput] = useState(value);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputId = useId();

  // Compress and resize image using HTML5 canvas
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1000;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        onChange(dataUrl);
        setUrlInput(dataUrl);
        setIsProcessing(false);
        setIsLibraryOpen(false);
      };
      img.onerror = () => setIsProcessing(false);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => setIsProcessing(false);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setIsLibraryOpen(false);
    }
  };

  const handleSelectPreset = (preset: PhotoPreset) => {
    onChange(preset.url);
    setUrlInput(preset.url);
    setIsLibraryOpen(false);
  };

  const categories = ['All', 'Curries', 'Tandoor & Starters', 'Biryani & Breads', 'Fast Food', 'Desserts & Drinks'];

  const filteredPresets = selectedCategory === 'All'
    ? PHOTO_PRESETS
    : PHOTO_PRESETS.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          Dish Photograph
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setUrlInput('');
            }}
            className="text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors"
          >
            <Trash2 size={13} />
            <span>Remove photo</span>
          </button>
        )}
      </div>

      {/* Main Preview Card */}
      <div
        className="rounded-2xl border p-3 sm:p-4 transition-all"
        style={{
          backgroundColor: 'var(--bg-input)',
          borderColor: 'var(--border-default)',
        }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4">
          {/* Image Thumbnail / Dropzone */}
          <div
            className={`relative w-full sm:w-44 h-36 rounded-xl overflow-hidden border shrink-0 flex items-center justify-center transition-all ${
              dragOver ? 'border-amber-500 scale-[1.02]' : ''
            }`}
            style={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-default)',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {value ? (
              <img
                src={value}
                alt="Dish preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=600&q=80';
                }}
              />
            ) : (
              <div className="text-center p-3">
                <ImageIcon size={28} className="mx-auto mb-1.5 opacity-30" />
                <span className="text-[11px] block font-medium" style={{ color: 'var(--text-muted)' }}>
                  No photo yet
                </span>
                <span className="text-[10px] block opacity-60" style={{ color: 'var(--text-muted)' }}>
                  Drop an image here
                </span>
              </div>
            )}

            {isProcessing && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center text-white text-xs font-semibold gap-1.5">
                <RefreshCw size={14} className="animate-spin" />
                <span>Optimizing...</span>
              </div>
            )}
          </div>

          {/* Quick Action Options */}
          <div className="flex-1 w-full space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Upload Button */}
              <label
                htmlFor={fileInputId}
                className="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                style={{
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <Upload size={14} style={{ color: 'var(--accent)' }} />
                <span>Upload from Device</span>
                <input
                  id={fileInputId}
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              {/* Browse Preset Photos */}
              <button
                type="button"
                onClick={() => {
                  setIsLibraryOpen(!isLibraryOpen);
                  setActiveTab('presets');
                }}
                className="py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all hover:bg-black/5 dark:hover:bg-white/5 active:scale-95"
                style={{
                  backgroundColor: isLibraryOpen && activeTab === 'presets' ? 'var(--accent-light)' : 'var(--bg-card)',
                  borderColor: isLibraryOpen && activeTab === 'presets' ? 'var(--accent)' : 'var(--border-default)',
                  color: isLibraryOpen && activeTab === 'presets' ? 'var(--accent)' : 'var(--text-primary)',
                }}
              >
                <Sparkles size={14} style={{ color: 'var(--accent)' }} />
                <span>{isLibraryOpen && activeTab === 'presets' ? 'Hide Photo Presets' : 'Pick from Presets'}</span>
              </button>
            </div>

            {/* Direct URL Row */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Link2
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50"
                />
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    onChange(e.target.value);
                  }}
                  placeholder="Or paste an image link (URL)..."
                  className="w-full pl-8 pr-3 py-2 text-xs rounded-xl border transition-colors outline-none"
                  style={{
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-default)',
                    color: 'var(--text-primary)',
                  }}
                />
              </div>

              {urlInput !== value && urlInput.trim() && (
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 rounded-xl text-xs font-semibold shrink-0"
                  style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
                >
                  Apply
                </button>
              )}
            </div>

            <p className="text-[11px]" style={{ color: 'var(--text-muted)' }}>
              Supports JPG, PNG, WEBP from your phone/PC (auto-compressed) or online links.
            </p>
          </div>
        </div>

        {/* Expandable Preset Photo Library Drawer */}
        {isLibraryOpen && (
          <div
            className="mt-4 pt-4 border-t space-y-3 animate-fade-in"
            style={{ borderColor: 'var(--border-default)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>
                Select a Food Photograph:
              </span>
              <button
                type="button"
                onClick={() => setIsLibraryOpen(false)}
                className="text-[11px] hover:underline"
                style={{ color: 'var(--text-muted)' }}
              >
                Close Gallery
              </button>
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30'
                      : 'text-zinc-500 hover:text-foreground border border-transparent'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid of Preset Photos */}
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-56 overflow-y-auto p-1 rounded-xl bg-black/5 dark:bg-black/20 border border-black/5 dark:border-white/5">
              {filteredPresets.map((preset) => {
                const isSelected = value === preset.url;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className={`group relative aspect-square rounded-lg overflow-hidden border transition-all hover:scale-105 ${
                      isSelected
                        ? 'ring-2 ring-amber-500 border-transparent shadow-md'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    title={preset.title}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-amber-500/40 flex items-center justify-center text-white">
                        <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center shadow-sm">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      </div>
                    )}
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[9px] truncate px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {preset.title}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
