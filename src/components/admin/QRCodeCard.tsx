import { useState, useRef } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { Copy, Check, Download, Printer, ExternalLink, QrCode } from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function QRCodeCard() {
  const { restaurant, addToast } = useData();
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate public menu URL based on current origin and restaurant slug
  const publicUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/menu/${restaurant.slug || 'the-spice-house'}`
    : `https://thespicehouse.com/menu/${restaurant.slug || 'the-spice-house'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      addToast('Menu link copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2500);
    } catch {
      addToast('Failed to copy link', 'error');
    }
  };

  const handleDownload = () => {
    // Find canvas element inside hidden or rendered ref
    const canvas = canvasRef.current?.querySelector('canvas');
    if (!canvas) {
      addToast('Could not generate download file', 'error');
      return;
    }

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${restaurant.slug || 'restaurant'}-qr-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    addToast('QR Code downloaded successfully!', 'success');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Admin Screen Card */}
      <div
        className="rounded-2xl border p-6 sm:p-8 no-print"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* QR Box Preview */}
          <div className="flex flex-col items-center">
            <div
              className="p-5 rounded-2xl border shadow-md flex items-center justify-center bg-white"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <QRCodeSVG
                value={publicUrl}
                size={200}
                level="H"
                includeMargin={true}
                fgColor="#161719"
              />
            </div>
            <p className="text-xs mt-3 font-medium text-center" style={{ color: 'var(--text-muted)' }}>
              Scan with phone camera to view menu
            </p>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-5 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}>
                <QrCode size={14} />
                Live Digital QR Menu
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {restaurant.name} QR Code
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Place this QR code on dining tables, flyers, billing counters, or restaurant entrance.
              </p>
            </div>

            {/* URL Display */}
            <div>
              <label className="block text-xs font-semibold mb-1 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Public Menu Link
              </label>
              <div
                className="flex items-center gap-2 p-3 rounded-xl border text-sm break-all"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  borderColor: 'var(--border-default)',
                  color: 'var(--text-primary)',
                }}
              >
                <span className="flex-1 select-all font-mono text-xs sm:text-sm">{publicUrl}</span>
                <button
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
                  style={{
                    backgroundColor: copied ? '#22c55e' : 'var(--accent)',
                    color: '#fff',
                  }}
                  title="Copy link"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleDownload}
                className="px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-transform active:scale-95 shadow-sm"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <Download size={16} />
                Download QR Code (PNG)
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl text-sm font-medium border flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                <Printer size={16} />
                Print Table Tent Card
              </button>

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl text-sm font-medium border flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                <ExternalLink size={16} />
                Open Live Menu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden high-res canvas used for clean PNG export */}
      <div ref={canvasRef} className="hidden" aria-hidden="true">
        <QRCodeCanvas
          value={publicUrl}
          size={800}
          level="H"
          includeMargin={true}
          fgColor="#161719"
        />
      </div>

      {/* Printable QR Standee / Table Card Preview (visible on screen and in print) */}
      <div className="no-print">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
            Printable Table Card Preview
          </h3>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Prints cleanly on A4 or 4x6" table tents
          </span>
        </div>
      </div>

      {/* Standee Container */}
      <div
        className="max-w-md mx-auto p-8 rounded-3xl border text-center shadow-lg transition-all"
        style={{
          backgroundColor: '#ffffff',
          borderColor: '#e5e5e5',
          color: '#1a1a1a',
        }}
      >
        <div className="border-2 border-dashed border-amber-300 rounded-2xl p-6">
          <div className="mb-2">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-700">
              Welcome to
            </span>
            <h2
              className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {restaurant.name}
            </h2>
            {restaurant.tagline && (
              <p className="text-xs text-gray-600 italic mt-0.5">{restaurant.tagline}</p>
            )}
          </div>

          <div className="my-6 inline-block p-4 bg-white rounded-2xl border-2 border-gray-900 shadow-sm">
            <QRCodeSVG
              value={publicUrl}
              size={180}
              level="H"
              includeMargin={false}
              fgColor="#161719"
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
              Scan For Digital Menu
            </p>
            <p className="text-xs text-gray-500">
              Point your smartphone camera to browse dishes, specialties & prices
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center text-[10px] text-gray-400">
            <span>Table Standee</span>
            <span>No App Needed • Browse Instantly</span>
          </div>
        </div>
      </div>
    </div>
  );
}
