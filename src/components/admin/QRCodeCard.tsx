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

  const PRODUCTION_DOMAIN = 'https://www.cafechococraze.xyz';
  const savedDomain = (restaurant.theme_preferences?.custom_domain as string) || PRODUCTION_DOMAIN;
  const [customDomain, setCustomDomain] = useState(savedDomain);
  const [isEditingDomain, setIsEditingDomain] = useState(false);

  useEffect(() => {
    if (restaurant.theme_preferences?.custom_domain) {
      setCustomDomain(restaurant.theme_preferences.custom_domain as string);
    }
  }, [restaurant.theme_preferences]);

  // Use configured domain if provided, default to production domain https://www.cafechococraze.xyz
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

  // Generate and download full 4"x9" stand sticker at 300 DPI (1200 x 2700 px)
  // Borderless, clean white, featuring the official website logo on both back and front faces
  const handleDownload10x6Standee = () => {
    setIsGeneratingPng(true);

    try {
      const bottomQrCanvas = bottomQrCanvasRef.current?.querySelector('canvas');
      if (!bottomQrCanvas) {
        addToast('QR canvas element not ready. Please try again.', 'error');
        setIsGeneratingPng(false);
        return;
      }

      const brandTitle = restaurant.name || 'Cafe Choco Craze';
      const cleanUrl = activeOrigin.replace(/^https?:\/\//, '');
      const logoSrc = restaurant.logo_url || '/cafe-choco-craze-logo.png';

      // Preload website logo image for canvas rendering
      const logoImg = new Image();
      logoImg.crossOrigin = 'anonymous';
      logoImg.src = logoSrc;

      const renderCanvasWithLogo = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1200;
        canvas.height = 2700;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          addToast('Canvas context not available', 'error');
          setIsGeneratingPng(false);
          return;
        }

        // Clean white background (no border)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, 1200, 2700);

        // ==========================================
        // SECTION 1: TOP 3" (0 to 900px)
        // BACK OF STAND (Flipped 180° for top curve fold)
        // Website Logo + Cafe Name ONLY
        // ==========================================
        ctx.save();
        ctx.translate(600, 450); // Center of 3" back section
        ctx.rotate(Math.PI);     // 180° rotation so when folded over top curve it reads upright

        // Website logo on back face
        const backLogoSize = 240;
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.drawImage(logoImg, -backLogoSize / 2, -260, backLogoSize, backLogoSize);
        }

        // "Cafe"
        ctx.fillStyle = '#b45309';
        ctx.font = 'italic 36px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '4px';
        ctx.textAlign = 'center';
        ctx.fillText('Cafe', 0, 40);

        // "CHOCO CRAZE"
        ctx.fillStyle = '#1e130c';
        ctx.font = '900 76px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '4px';
        ctx.fillText('CHOCO CRAZE', 0, 120);

        // Tagline
        ctx.fillStyle = '#7c481e';
        ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('Crafted with Love   •   Served with Joy', 0, 185);

        ctx.restore();

        // ==========================================
        // SECTION 2: BOTTOM 6" (900px to 2700px)
        // FRONT OF STAND (Upright)
        // Website Logo + Welcome + MENU + QR + URL
        // ==========================================
        ctx.save();
        ctx.translate(600, 1800);

        // Website logo on front face
        const frontLogoSize = 200;
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          ctx.drawImage(logoImg, -frontLogoSize / 2, -800, frontLogoSize, frontLogoSize);
        }

        ctx.textAlign = 'center';

        // Cafe Name on Front Face
        ctx.fillStyle = '#b45309';
        ctx.font = 'italic 30px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '3px';
        ctx.fillText('WELCOME TO', 0, -560);

        ctx.fillStyle = '#1e130c';
        ctx.font = '900 64px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '3px';
        ctx.fillText('CAFE CHOCO CRAZE', 0, -500);

        // Tagline
        ctx.fillStyle = '#92400e';
        ctx.font = 'italic 26px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('Delicious Cold Coffee   •   Irresistibly Sweet', 0, -455);

        // Word MENU - High attention hero
        ctx.fillStyle = '#1e130c';
        ctx.font = '900 135px "Playfair Display", Georgia, serif';
        ctx.letterSpacing = '10px';
        ctx.fillText('MENU', 0, -320);

        // QR Code Box (Single clean card)
        const qrBox = 560;
        const qrY = -250;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(-qrBox / 2, qrY, qrBox, qrBox);
        ctx.strokeStyle = '#1e130c';
        ctx.lineWidth = 4;
        ctx.strokeRect(-qrBox / 2, qrY, qrBox, qrBox);

        // Draw high-res QR
        const qrImg = 520;
        ctx.drawImage(bottomQrCanvas, -qrImg / 2, qrY + (qrBox - qrImg) / 2, qrImg, qrImg);

        // URL
        ctx.fillStyle = '#b45309';
        ctx.font = 'bold 36px "Inter", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText(cleanUrl, 0, 370);

        // SCAN FOR MENU
        ctx.fillStyle = '#1e130c';
        ctx.font = '800 54px "Inter", sans-serif';
        ctx.letterSpacing = '6px';
        ctx.fillText('SCAN FOR MENU', 0, 445);

        // Point camera
        ctx.fillStyle = '#4b5563';
        ctx.font = 'italic 32px "Playfair Display", Georgia, serif';
        ctx.fillText('Point your camera to view items', 0, 500);

        // Tagline at footer
        ctx.fillStyle = '#92400e';
        ctx.font = 'bold 26px "Inter", sans-serif';
        ctx.letterSpacing = '2px';
        ctx.fillText('Thick Cold Coffees   •   Shakes   •   100% Pure Veg', 0, 570);

        ctx.restore();

        // Trigger download of the 4x9 standee image
        const dataUrl = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = dataUrl;
        downloadLink.download = `${restaurant.slug || 'cafe-choco-craze'}-4x9-stand-sticker.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

        addToast('4×9 Stand Sticker downloaded at 300 DPI!', 'success');
        setIsGeneratingPng(false);
      };

      if (logoImg.complete) {
        renderCanvasWithLogo();
      } else {
        logoImg.onload = renderCanvasWithLogo;
        logoImg.onerror = () => {
          // If logo fails to load, render without failing
          renderCanvasWithLogo();
        };
      }
    } catch (err) {
      console.error('Failed to generate 4x9 standee', err);
      addToast('Failed to generate 4×9 image', 'error');
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
                      placeholder="https://www.cafechococraze.xyz"
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
                {isGeneratingPng ? 'Generating 300 DPI...' : 'Download 9×4 Stand Sticker (PNG)'}
              </button>

              <button
                onClick={handlePrint}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border flex items-center gap-2 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
                style={{ borderColor: 'var(--border-default)', color: 'var(--text-primary)' }}
              >
                <Printer size={16} />
                Print 9×4 Stand Sticker
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
            4" × 9" Curved Stand Sticker Preview
          </h3>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            One single 4" wide × 9" continuous sticker: Top 3" folds over the curve to the back (Logo & Name), bottom 6" is the upright front face (QR & MENU).
          </p>
        </div>
      </div>

      {/* 4" x 9" VERTICAL STANDEE STICKER CONTAINER (Clean white, borderless) */}
      <div
        className="print-standee-card mx-auto rounded-3xl relative overflow-hidden transition-all text-center select-none shadow-xl border border-gray-200"
        style={{
          width: '100%',
          maxWidth: '420px',
          aspectRatio: '4 / 9',
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
        }}
      >
        {/* Subtle curve fold guideline (hidden during print) */}
        <div
          className="no-print absolute left-6 right-6 top-[33.33%] h-[1px] pointer-events-none z-15"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(180,83,9,0.2) 15%, #b45309 50%, rgba(180,83,9,0.2) 85%, transparent)',
          }}
        />

        {/* Continuous 4"x9" Flex Column */}
        <div className="w-full h-full flex flex-col justify-between p-4 sm:p-5">
          {/* =======================================================
              SECTION 1: TOP 3" (33.3% height) - BACK OF STAND
              Inverted (rotate-180) so it reads upright when folded over top curve
              ======================================================= */}
          <div className="w-full h-[33.33%] flex flex-col items-center justify-center relative z-10 rotate-180">
            {/* Visual badge hidden during print */}
            <span className="no-print absolute -top-1 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              3" × 4" Stand Back (Inverted for curve)
            </span>

            {/* Official Website Logo */}
            <img
              src={restaurant.logo_url || '/cafe-choco-craze-logo.png'}
              alt={restaurant.name}
              className="w-16 h-16 sm:w-20 sm:h-20 object-contain mb-1.5"
            />

            <span className="text-[10px] italic font-serif text-[#b45309] tracking-widest leading-none">
              Cafe
            </span>
            <div
              className="text-xl sm:text-2xl font-black tracking-wider text-[#1e130c] leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              CHOCO CRAZE
            </div>

            <p className="text-[8px] sm:text-[9px] italic font-serif text-[#7c481e] mt-1">
              Crafted with Love • Served with Joy
            </p>
          </div>

          {/* =======================================================
              SECTION 2: BOTTOM 6" (66.67% height) - FRONT OF STAND (Upright)
              Website Logo + Welcome + MENU + QR + URL
              ======================================================= */}
          <div className="w-full h-[66.67%] flex flex-col items-center justify-between pt-4 pb-2 relative z-10">
            {/* Visual badge hidden during print */}
            <span className="no-print text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              6" × 4" Stand Front (Upright)
            </span>

            {/* Official Website Logo */}
            <img
              src={restaurant.logo_url || '/cafe-choco-craze-logo.png'}
              alt={restaurant.name}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain my-0.5"
            />

            {/* Cafe Name on Front Face */}
            <div className="text-center my-0.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 block">
                Welcome to
              </span>
              <h2
                className="text-lg sm:text-xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {restaurant.name || 'Cafe Choco Craze'}
              </h2>
              <span className="text-[9px] italic font-serif text-[#92400e] tracking-wide block">
                Delicious Cold Coffee &nbsp;•&nbsp; Irresistibly Sweet
              </span>
            </div>

            {/* Hero MENU */}
            <h3
              className="text-3xl sm:text-4xl font-black tracking-widest text-[#1e130c] leading-none my-0.5"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              MENU
            </h3>

            {/* Laser scan line bar (No WiFi) */}
            <div className="w-3/5 flex flex-col items-center my-0.5">
              <div
                className="w-full h-[1.5px]"
                style={{
                  background:
                    'linear-gradient(90deg, transparent, #b8873f 30%, #e6b340 50%, #b8873f 70%, transparent)',
                }}
              />
            </div>

            {/* Standalone clean QR Code */}
            <div className="p-1.5 bg-white rounded-xl border-2 border-[#1e130c] shadow-md inline-block my-0.5">
              <QRCodeSVG
                value={publicUrl}
                size={110}
                level="H"
                includeMargin={false}
                fgColor="#161719"
              />
            </div>

            <div className="space-y-0.5 text-center">
              <p className="text-[10px] font-bold text-[#b45309] tracking-wider font-mono">
                {publicUrl.replace(/^https?:\/\//, '')}
              </p>
              <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#1e130c]">
                SCAN FOR MENU
              </p>
              <p className="text-[9px] italic text-[#4b5563] font-serif">
                Point your camera to view items
              </p>
            </div>

            {/* Bottom food tags */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-50 rounded-full border border-amber-200 text-[8.5px] font-semibold text-amber-800">
              <span>☕ Thick Cold Coffees</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">🟢 100% Pure Veg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
