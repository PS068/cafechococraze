import { useState, useRef, useEffect } from 'react';
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import {
  Copy,
  Check,
  Download,
  Printer,
  ExternalLink,
  QrCode,
  Globe,
  Edit3,
  Save,
  RotateCw,
  Sparkles,
  Coffee,
  Wifi,
} from 'lucide-react';
import { useData } from '../../context/DataContext';

export default function QRCodeCard() {
  const { restaurant, updateRestaurant, addToast } = useData();
  const [copied, setCopied] = useState(false);
  const [isFlippedPreview, setIsFlippedPreview] = useState(true);
  const [isGeneratingPng, setIsGeneratingPng] = useState(false);

  // Hidden canvas refs for QR code rasterization
  const singleQrCanvasRef = useRef<HTMLDivElement>(null);
  const topQrCanvasRef = useRef<HTMLDivElement>(null);
  const bottomQrCanvasRef = useRef<HTMLDivElement>(null);

  const PRODUCTION_DOMAIN = 'https://chococraze.xyz';
  const savedDomain = (restaurant.theme_preferences?.custom_domain as string) || PRODUCTION_DOMAIN;
  const [customDomain, setCustomDomain] = useState(savedDomain);
  const [isEditingDomain, setIsEditingDomain] = useState(false);

  useEffect(() => {
    if (restaurant.theme_preferences?.custom_domain) {
      setCustomDomain(restaurant.theme_preferences.custom_domain as string);
    }
  }, [restaurant.theme_preferences]);

  // Use configured domain if provided, default to production domain https://chococraze.xyz
  const activeOrigin = customDomain.trim() ? customDomain.trim().replace(/\/$/, '') : PRODUCTION_DOMAIN;
  const publicUrl = activeOrigin;

  const handleSaveDomain = async () => {
    await updateRestaurant({
      theme_preferences: {
        ...restaurant.theme_preferences,
        custom_domain: customDomain.trim(),
      },
    });
    setIsEditingDomain(false);
    addToast('Live deployment link saved! QR code updated.', 'success');
  };

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

  // Download single QR code PNG
  const handleDownloadSingleQr = () => {
    const canvas = singleQrCanvasRef.current?.querySelector('canvas');
    if (!canvas) {
      addToast('Could not generate download file', 'error');
      return;
    }

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${restaurant.slug || 'cafe-choco-craze'}-qr-code.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    addToast('QR Code downloaded successfully!', 'success');
  };

  // Generate and download full 10x6 dual-side standee at 300 DPI (1800 x 3000 px)
  const handleDownload10x6Standee = () => {
    setIsGeneratingPng(true);

    try {
      const topQrCanvas = topQrCanvasRef.current?.querySelector('canvas');
      const bottomQrCanvas = bottomQrCanvasRef.current?.querySelector('canvas');

      if (!topQrCanvas || !bottomQrCanvas) {
        addToast('QR canvas elements not ready. Please try again.', 'error');
        setIsGeneratingPng(false);
        return;
      }

      // 6" width x 10" length @ 300 DPI = 1800 x 3000 px
      const canvas = document.createElement('canvas');
      canvas.width = 1800;
      canvas.height = 3000;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        addToast('Canvas context not available', 'error');
        setIsGeneratingPng(false);
        return;
      }

      // Background: Pure clean white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1800, 3000);

      const brandTitle = restaurant.name || 'Cafe Choco Craze';
      const brandTagline = restaurant.tagline || 'Delicious Beverages, Unforgettable Moments';
      const cleanUrl = activeOrigin.replace(/^https?:\/\//, '');

      // ==========================================
      // SECTION 1: 4" x 4" (Top 40% = 0 to 1200px)
      // Vertically flipped (180° rotation) for folded acrylic stand
      // ==========================================
      ctx.save();
      // Translate to center of 4x4 section (width: 1800, height: 1200)
      ctx.translate(900, 600);
      ctx.rotate(Math.PI); // 180 degree flip

      // Section 1 Content
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '4px';
      ctx.fillText('WELCOME TO', 0, -360);

      ctx.fillStyle = '#1e130c';
      ctx.font = 'bold 74px "Playfair Display", Georgia, serif';
      ctx.fillText(brandTitle, 0, -280);

      // 4x4 QR Code (520 x 520 px)
      const topQrSize = 520;
      ctx.drawImage(topQrCanvas, -topQrSize / 2, -220, topQrSize, topQrSize);

      ctx.fillStyle = '#1e130c';
      ctx.font = 'bold 44px "Inter", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('SCAN FOR DIGITAL MENU', 0, 360);

      ctx.fillStyle = '#6b7280';
      ctx.font = '32px "Inter", sans-serif';
      ctx.fillText(`No App Needed  •  ${cleanUrl}`, 0, 415);

      ctx.restore();

      // (Notice: NO dividing line is drawn anywhere!)

      // ==========================================
      // SECTION 2: 6" x 4" (Bottom 60% = 1200 to 3000px)
      // Upright orientation for front of acrylic stand
      // ==========================================
      ctx.save();
      // Center of 6x4 section (width: 1800, height: 1800, starting from y=1200 -> center is 1200 + 900 = 2100)
      ctx.translate(900, 2100);

      // Section 2 Content
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 38px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '5px';
      ctx.fillText('WELCOME TO', 0, -640);

      ctx.fillStyle = '#1e130c';
      ctx.font = 'bold 96px "Playfair Display", Georgia, serif';
      ctx.fillText(brandTitle, 0, -530);

      ctx.fillStyle = '#4b5563';
      ctx.font = 'italic 38px "Playfair Display", Georgia, serif';
      ctx.fillText(brandTagline, 0, -460);

      // 6x4 QR Code (680 x 680 px)
      const bottomQrSize = 680;
      ctx.drawImage(bottomQrCanvas, -bottomQrSize / 2, -380, bottomQrSize, bottomQrSize);

      ctx.fillStyle = '#1e130c';
      ctx.font = 'bold 52px "Inter", sans-serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('SCAN TO BROWSE OUR MENU', 0, 370);

      ctx.fillStyle = '#6b7280';
      ctx.font = '36px "Inter", sans-serif';
      ctx.fillText('Point your phone camera to view items, shakes & prices', 0, 430);

      // Highlights pill line
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 34px "Inter", sans-serif';
      ctx.fillText('☕ Beverages & Shakes   •   🟢 100% Pure Veg   •   📶 Free Wi-Fi', 0, 520);

      // Footer
      ctx.fillStyle = '#9ca3af';
      ctx.font = '30px "Inter", sans-serif';
      ctx.fillText(`Table Standee   •   ${cleanUrl}`, 0, 620);

      ctx.restore();

      // Trigger download of the 10x6 standee image
      const dataUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = `${restaurant.slug || 'cafe-choco-craze'}-10x6-standee.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      addToast('10×6 Dual Standee downloaded at 300 DPI!', 'success');
    } catch (err) {
      console.error('Failed to generate 10x6 standee', err);
      addToast('Failed to generate 10×6 image', 'error');
    } finally {
      setIsGeneratingPng(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Admin Screen Controls & Info */}
      <div
        className="rounded-2xl border p-6 sm:p-8 no-print"
        style={{
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-default)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Mini QR Box */}
          <div className="flex flex-col items-center mx-auto lg:mx-0 shrink-0">
            <div
              className="p-4 rounded-2xl border shadow-md flex items-center justify-center bg-white"
              style={{ borderColor: 'var(--border-default)' }}
            >
              <QRCodeSVG
                value={publicUrl}
                size={160}
                level="H"
                includeMargin={true}
                fgColor="#161719"
              />
            </div>
            <p className="text-xs mt-2.5 font-medium text-center" style={{ color: 'var(--text-muted)' }}>
              Live Digital Menu QR
            </p>
          </div>

          {/* Details & Actions */}
          <div className="flex-1 space-y-5 text-center lg:text-left w-full">
            <div>
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-2"
                style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                <Sparkles size={14} />
                10" × 6" Dual-Section Table Standee Ready
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
              >
                {restaurant.name} Table QR Stand
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>
                Configured as a continuous <strong>10" × 6" card</strong> with 2 seamless sections: a{' '}
                <strong>6" × 4" front section</strong> and an inverted <strong>4" × 4" section</strong> for double-sided
                acrylic table tents without any separating lines.
              </p>
            </div>

            {/* URL Display */}
            <div>
              <label
                className="block text-xs font-semibold mb-1 uppercase tracking-wider"
                style={{ color: 'var(--text-muted)' }}
              >
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

              {/* Live Domain Override */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
                    <Globe size={13} className="text-amber-500" />
                    <span>Live Domain Configuration</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsEditingDomain(!isEditingDomain)}
                    className="text-xs font-semibold hover:underline flex items-center gap-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    <Edit3 size={12} />
                    <span>{isEditingDomain ? 'Cancel' : 'Change Domain'}</span>
                  </button>
                </div>

                {isEditingDomain ? (
                  <div className="flex items-center gap-2 animate-fade-in">
                    <input
                      type="url"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="https://chococraze.xyz"
                      className="flex-1 px-3 py-2 text-xs rounded-xl border outline-none font-mono"
                      style={{
                        backgroundColor: 'var(--bg-input)',
                        borderColor: 'var(--border-default)',
                        color: 'var(--text-primary)',
                      }}
                    />
                    <button
                      type="button"
                      onClick={handleSaveDomain}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 shrink-0"
                      style={{
                        backgroundColor: 'var(--accent)',
                        color: 'var(--text-inverse)',
                      }}
                    >
                      <Save size={13} />
                      <span>Update QR</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    ✓ QR code linked to live production domain:{' '}
                    <span className="font-mono font-semibold">{activeOrigin}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={handleDownload10x6Standee}
                disabled={isGeneratingPng}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-transform active:scale-95 shadow-md"
                style={{ backgroundColor: 'var(--accent)', color: 'var(--text-inverse)' }}
              >
                <Download size={16} />
                {isGeneratingPng ? 'Generating 300 DPI...' : 'Download 10×6 Standee (PNG)'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                <Printer size={16} />
                Print 10×6 Standee Card
              </button>

              <button
                onClick={handleDownloadSingleQr}
                className="px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
                title="Download square QR code only"
              >
                <QrCode size={14} />
                QR Code Only
              </button>

              <a
                href={publicUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl text-xs font-medium border flex items-center gap-1.5 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-secondary)' }}
              >
                <ExternalLink size={14} />
                Live Menu
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Hidden high-res canvas elements for rasterization */}
      <div className="hidden" aria-hidden="true">
        <div ref={singleQrCanvasRef}>
          <QRCodeCanvas value={publicUrl} size={800} level="H" includeMargin={true} fgColor="#161719" />
        </div>
        <div ref={topQrCanvasRef}>
          <QRCodeCanvas value={publicUrl} size={600} level="H" includeMargin={false} fgColor="#161719" />
        </div>
        <div ref={bottomQrCanvasRef}>
          <QRCodeCanvas value={publicUrl} size={700} level="H" includeMargin={false} fgColor="#161719" />
        </div>
      </div>

      {/* Standee Preview Section Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3
            className="text-lg font-bold flex items-center gap-2"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            10" × 6" Dual-Section Standee Preview
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            One single 10" length containing a 4"×4" flipped section and a 6"×4" upright section with no dividing line.
          </p>
        </div>

        {/* Preview orientation toggle */}
        <button
          type="button"
          onClick={() => setIsFlippedPreview(!isFlippedPreview)}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors shadow-sm"
          style={{
            borderColor: 'var(--border-default)',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-primary)',
          }}
          title="Toggle 4x4 section orientation in preview"
        >
          <RotateCw size={13} className={isFlippedPreview ? 'text-amber-500' : ''} />
          <span>{isFlippedPreview ? '4×4 Flipped (Fold-Ready)' : '4×4 Upright (Reading Mode)'}</span>
        </button>
      </div>

      {/* 10" x 6" STANDEE CARD CONTAINER
          Printable card: Exactly 6in wide by 10in tall in print, styled with high contrast and no dividing line */}
      <div
        className="print-standee-card mx-auto rounded-3xl border shadow-xl overflow-hidden transition-all text-center"
        style={{
          width: '100%',
          maxWidth: '480px', // On screen scaled preview
          aspectRatio: '6 / 10', // Exact 6 width to 10 height ratio
          backgroundColor: '#ffffff',
          borderColor: '#e5e7eb',
          color: '#1a1a1a',
        }}
      >
        {/* Continuous 10" length flex column */}
        <div className="w-full h-full flex flex-col justify-between p-6 sm:p-8 bg-white select-none">
          {/* =======================================================
              SECTION 1: 4" × 4" (Top 40% height of 10" length)
              Vertically flipped (180° rotation) for the back of the acrylic stand
              ======================================================= */}
          <div
            className={`w-full flex-1 flex flex-col items-center justify-center p-3 transition-transform duration-300 ${
              isFlippedPreview ? 'rotate-180' : ''
            }`}
            style={{
              maxHeight: '40%',
            }}
          >
            {/* Visual Screen Badge for Admin Context (hidden during print) */}
            <div className="no-print mb-1">
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                4" × 4" {isFlippedPreview ? 'Stand Back (Flipped 180°)' : 'Stand Back'}
              </span>
            </div>

            <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700">
              Welcome to
            </span>
            <h3
              className="text-lg sm:text-xl font-bold text-gray-900 leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              {restaurant.name}
            </h3>

            {/* 4x4 QR Code with generous breathing margin */}
            <div className="my-2.5 p-2.5 bg-white rounded-xl border border-gray-900 shadow-sm inline-block">
              <QRCodeSVG
                value={publicUrl}
                size={120}
                level="H"
                includeMargin={false}
                fgColor="#161719"
              />
            </div>

            <p className="text-[11px] font-bold text-gray-900 uppercase tracking-wider">
              Scan For Digital Menu
            </p>
            <p className="text-[9px] text-gray-500">
              No App Needed • Browse Instantly
            </p>
          </div>

          {/* FOLDING BUFFER SPACE (Clean whitespace adjustment, NO DIVIDING LINE!) */}
          <div className="w-full py-2 my-auto" aria-hidden="true" />

          {/* =======================================================
              SECTION 2: 6" × 4" (Bottom 60% height of 10" length)
              Upright orientation for the front of the acrylic stand
              ======================================================= */}
          <div
            className="w-full flex-1 flex flex-col items-center justify-center p-3"
            style={{
              minHeight: '55%',
            }}
          >
            {/* Visual Screen Badge for Admin Context (hidden during print) */}
            <div className="no-print mb-1.5">
              <span className="text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                6" × 4" Stand Front (Upright)
              </span>
            </div>

            <div className="mb-2">
              <span className="text-[11px] uppercase tracking-widest font-bold text-amber-700">
                Welcome to
              </span>
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mt-0.5"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {restaurant.name}
              </h2>
              {restaurant.tagline && (
                <p className="text-xs text-gray-600 italic mt-0.5 line-clamp-1 max-w-[320px]">
                  {restaurant.tagline}
                </p>
              )}
            </div>

            {/* 6x4 QR Code Box */}
            <div className="my-3 p-3 bg-white rounded-2xl border-2 border-gray-900 shadow-md inline-block">
              <QRCodeSVG
                value={publicUrl}
                size={160}
                level="H"
                includeMargin={false}
                fgColor="#161719"
              />
            </div>

            <div className="space-y-1">
              <p className="text-xs sm:text-sm font-extrabold text-gray-900 uppercase tracking-wider">
                Scan To View Digital Menu
              </p>
              <p className="text-[10px] text-gray-500 max-w-[280px]">
                Point your phone camera to explore beverages, shakes & prices
              </p>
            </div>

            {/* Feature badges */}
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-200 text-[10px] font-semibold text-amber-800">
              <Coffee size={12} />
              <span>Beverages & Shakes</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">🟢 100% Veg</span>
              <span>•</span>
              <Wifi size={12} />
              <span>Free Wi-Fi</span>
            </div>

            {/* Footer info */}
            <div className="mt-4 pt-2 border-t border-gray-100 w-full flex justify-between items-center text-[9px] text-gray-400">
              <span>Table Standee</span>
              <span className="font-mono text-gray-500">chococraze.xyz</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
