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

  // Generate and download full 4"x9" stand sticker at 300 DPI (1200 x 2700 px)
  // Physical stand: 4" wide. Top 3" folds over curve to back (upside down on sheet). Bottom 6" is upright front.
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

      // 4" width x 9" length @ 300 DPI = 1200 x 2700 px
      const canvas = document.createElement('canvas');
      canvas.width = 1200;
      canvas.height = 2700;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        addToast('Canvas context not available', 'error');
        setIsGeneratingPng(false);
        return;
      }

      // Background: Crisp clean white
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 1200, 2700);

      // FULL GOLDEN BORDER (around entire 4x9 sticker)
      // 1. Outer hairline gold
      ctx.strokeStyle = '#d4a243';
      ctx.lineWidth = 4;
      ctx.strokeRect(16, 16, 1200 - 32, 2700 - 32);

      // 2. Ornate gold band
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 10;
      ctx.strokeRect(26, 26, 1200 - 52, 2700 - 52);

      // 3. Inner hairline gold
      ctx.strokeStyle = '#e6b340';
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, 1200 - 72, 2700 - 72);

      // Corner stars
      ctx.fillStyle = '#b8873f';
      ctx.font = '32px serif';
      ctx.textAlign = 'center';
      ctx.fillText('✦', 54, 62);
      ctx.fillText('✦', 1200 - 54, 62);
      ctx.fillText('✦', 54, 2700 - 44);
      ctx.fillText('✦', 1200 - 54, 2700 - 44);

      // Curve fold guideline (y = 900px, 3 inches from top)
      const foldY = 900;

      // ==========================================
      // SECTION 1: TOP 3" (0 to 900px)
      // BACK OF STAND (Flipped 180° for top curve fold)
      // Cafe Name + Logo ONLY (NO QR, NO WIFI)
      // ==========================================
      ctx.save();
      ctx.translate(600, 450); // Center of 3" back section
      ctx.rotate(Math.PI);     // 180° rotation so when folded over top curve it reads upright

      // Coffee emblem circle
      const embY = -160;
      ctx.beginPath();
      ctx.arc(0, embY, 115, 0, Math.PI * 2);
      ctx.fillStyle = '#fdf8f0';
      ctx.fill();
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, embY, 102, 0, Math.PI * 2);
      ctx.strokeStyle = '#e6b340';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Coffee Cup inside emblem
      ctx.fillStyle = '#7c481e';
      ctx.beginPath();
      ctx.moveTo(-50, embY - 5);
      ctx.bezierCurveTo(-50, embY + 60, 50, embY + 60, 50, embY - 5);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Saucer
      ctx.beginPath();
      ctx.ellipse(0, embY + 68, 65, 12, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#95682b';
      ctx.fill();
      ctx.stroke();

      // Cup handle
      ctx.beginPath();
      ctx.arc(55, embY + 20, 18, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 6;
      ctx.stroke();

      // Steam swirls
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-20, embY - 18);
      ctx.bezierCurveTo(-28, embY - 42, -12, embY - 58, -20, embY - 78);
      ctx.moveTo(0, embY - 18);
      ctx.bezierCurveTo(-8, embY - 42, 8, embY - 58, 0, embY - 82);
      ctx.moveTo(20, embY - 18);
      ctx.bezierCurveTo(12, embY - 42, 28, embY - 58, 20, embY - 78);
      ctx.stroke();

      // "Cafe"
      ctx.fillStyle = '#b45309';
      ctx.font = 'italic 38px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('Cafe', 0, 20);

      // "CHOCO CRAZE"
      ctx.fillStyle = '#1e130c';
      ctx.font = '900 78px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '5px';
      ctx.fillText('CHOCO CRAZE', 0, 105);

      // Flourish divider
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-180, 150);
      ctx.lineTo(-25, 150);
      ctx.moveTo(25, 150);
      ctx.lineTo(180, 150);
      ctx.stroke();
      ctx.fillStyle = '#b8873f';
      ctx.font = '24px serif';
      ctx.fillText('✦', 0, 158);

      // Tagline
      ctx.fillStyle = '#7c481e';
      ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('Crafted with Love   •   Served with Joy', 0, 210);

      ctx.restore();

      // ==========================================
      // SECTION 2: BOTTOM 6" (900px to 2700px)
      // FRONT OF STAND (Upright)
      // CAFE NAME + MENU + QR + COFFEE & PIZZA ELEMENTS
      // Center y = 1800px, height = 1800px
      // ==========================================
      ctx.save();
      ctx.translate(600, 1800);

      // Top Cafe Name on Front Face
      ctx.fillStyle = '#b45309';
      ctx.font = 'italic 32px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '3px';
      ctx.fillText('WELCOME TO', 0, -710);

      ctx.fillStyle = '#1e130c';
      ctx.font = '900 68px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '4px';
      ctx.fillText('CAFE CHOCO CRAZE', 0, -640);

      // Tagline
      ctx.fillStyle = '#92400e';
      ctx.font = 'italic 28px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('Delicious Cold Coffee   •   Irresistibly Sweet', 0, -590);

      // Gold divider
      ctx.strokeStyle = '#d4a243';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-320, -565);
      ctx.lineTo(320, -565);
      ctx.stroke();

      // Eye-Pleasing Element 1: Steaming Coffee Cup Icon (Left of MENU)
      const cupX = -270;
      const cupY = -460;
      ctx.save();
      ctx.translate(cupX, cupY);
      // Cup body
      ctx.fillStyle = '#95682b';
      ctx.beginPath();
      ctx.moveTo(-22, -8);
      ctx.bezierCurveTo(-22, 22, 22, 22, 22, -8);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 2.5;
      ctx.stroke();
      // Saucer
      ctx.beginPath();
      ctx.ellipse(0, 26, 28, 5, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#7c481e';
      ctx.fill();
      ctx.stroke();
      // Handle
      ctx.beginPath();
      ctx.arc(24, 6, 8, -Math.PI / 2, Math.PI / 2);
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 3;
      ctx.stroke();
      // Steam
      ctx.strokeStyle = '#d4a243';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-8, -14);
      ctx.bezierCurveTo(-12, -24, -4, -30, -8, -40);
      ctx.moveTo(8, -14);
      ctx.bezierCurveTo(4, -24, 12, -30, 8, -40);
      ctx.stroke();
      ctx.restore();

      // Word MENU - High attention hero
      ctx.fillStyle = '#1e130c';
      ctx.font = '900 135px "Playfair Display", Georgia, serif';
      ctx.letterSpacing = '8px';
      ctx.fillText('MENU', 0, -440);

      // Eye-Pleasing Element 2: Pizza Slice Icon (Right of MENU)
      const pizzaX = 270;
      const pizzaY = -465;
      ctx.save();
      ctx.translate(pizzaX, pizzaY);
      // Crust
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(0, 0, 36, -Math.PI * 0.72, -Math.PI * 0.28);
      ctx.stroke();
      // Slice body
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(0, 26);
      ctx.lineTo(-24, -22);
      ctx.quadraticCurveTo(0, -30, 24, -22);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2;
      ctx.stroke();
      // Pepperoni / toppings
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(-6, -10, 4, 0, Math.PI * 2);
      ctx.arc(8, -8, 4.5, 0, Math.PI * 2);
      ctx.arc(0, 8, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Laser scan beam line (Clean horizontal lines, no WiFi icon)
      ctx.strokeStyle = '#b8873f';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-280, -395);
      ctx.lineTo(280, -395);
      ctx.stroke();

      // QR Code Box (Single clean card)
      const qrBox = 540;
      const qrY = -360;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-qrBox / 2, qrY, qrBox, qrBox);
      ctx.strokeStyle = '#1e130c';
      ctx.lineWidth = 4;
      ctx.strokeRect(-qrBox / 2, qrY, qrBox, qrBox);

      // Draw high-res QR
      const qrImg = 500;
      ctx.drawImage(bottomQrCanvas, -qrImg / 2, qrY + (qrBox - qrImg) / 2, qrImg, qrImg);

      // URL
      ctx.fillStyle = '#b45309';
      ctx.font = 'bold 36px "Inter", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText(cleanUrl, 0, 250);

      // SCAN FOR MENU
      ctx.fillStyle = '#1e130c';
      ctx.font = '800 56px "Inter", sans-serif';
      ctx.letterSpacing = '6px';
      ctx.fillText('SCAN FOR MENU', 0, 335);

      // Point camera
      ctx.fillStyle = '#4b5563';
      ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
      ctx.fillText('Point your camera to view items', 0, 395);

      // Eye-Pleasing Element 3: Accent Highlights at footer (Coffee ☕ • Pizza 🍕 • Pure Veg 🟢)
      ctx.fillStyle = '#92400e';
      ctx.font = 'bold 28px "Inter", sans-serif';
      ctx.letterSpacing = '2px';
      ctx.fillText('☕ Beverages & Shakes   •   🍕 Cafe Bites   •   🟢 100% Veg', 0, 480);

      // Footer brand name
      ctx.fillStyle = '#9ca3af';
      ctx.font = 'bold 24px "Inter", sans-serif';
      ctx.letterSpacing = '3px';
      ctx.fillText(`Table Standee  •  ${cleanUrl}`, 0, 540);

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
    } catch (err) {
      console.error('Failed to generate 4x9 standee', err);
      addToast('Failed to generate 4×9 image', 'error');
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

      {/* 4" x 9" VERTICAL STANDEE STICKER CONTAINER */}
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
        {/* Full Golden Border on the whole 4x9 sheet */}
        <div className="absolute inset-[6px] rounded-2xl border-[1.5px] border-[#d4a243] pointer-events-none z-20" />
        <div
          className="absolute inset-[10px] rounded-xl border-[4px] border-transparent pointer-events-none z-21"
          style={{
            background:
              'repeating-linear-gradient(45deg, #b8873f 0px, #f4dfa8 3px, #e6b340 6px, #975a1c 9px, #b8873f 12px) border-box',
            WebkitMask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'destination-out',
            maskComposite: 'exclude',
          }}
        />
        <div className="absolute inset-[16px] rounded-lg border border-[#e6b340]/50 pointer-events-none z-22" />

        {/* Corner Flourishes */}
        <span className="absolute top-1 left-2 text-[#b8873f] text-xs z-30 select-none">✦</span>
        <span className="absolute top-1 right-2 text-[#b8873f] text-xs z-30 select-none">✦</span>
        <span className="absolute bottom-1 left-2 text-[#b8873f] text-xs z-30 select-none">✦</span>
        <span className="absolute bottom-1 right-2 text-[#b8873f] text-xs z-30 select-none">✦</span>

        {/* FOLD CURVE GUIDELINE (at 33.3% height) */}
        <div
          className="absolute left-6 right-6 top-[33.33%] h-[1px] pointer-events-none z-15"
          style={{
            background:
              'linear-gradient(90deg, transparent, rgba(184,135,63,0.3) 15%, #b8873f 50%, rgba(184,135,63,0.3) 85%, transparent)',
          }}
        />

        {/* Continuous 4"x9" Flex Column */}
        <div className="w-full h-full flex flex-col justify-between">
          {/* =======================================================
              SECTION 1: TOP 3" (33.3% height) - BACK OF STAND
              Inverted (rotate-180) so it reads upright when folded over top curve
              ======================================================= */}
          <div className="w-full h-[33.33%] flex flex-col items-center justify-center p-4 relative z-10 rotate-180">
            {/* Visual badge hidden during print */}
            <span className="no-print absolute top-2 text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
              3" × 4" Stand Back (Inverted for curve)
            </span>

            {/* Coffee Emblem */}
            <div className="w-12 h-12 rounded-full border-2 border-[#b8873f] flex items-center justify-center bg-[#fdf8f0] shadow-sm mb-1">
              <Coffee size={20} className="text-[#95682b]" />
            </div>

            <span className="text-[10px] italic font-serif text-[#b45309] tracking-widest leading-none">
              Cafe
            </span>
            <div
              className="text-xl sm:text-2xl font-black tracking-wider text-[#1e130c] leading-tight"
              style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
            >
              CHOCO CRAZE
            </div>

            <div className="w-2/3 flex items-center justify-center gap-1.5 my-1">
              <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent to-[#b8873f]" />
              <span className="text-[9px] text-[#b8873f]">✦</span>
              <div className="flex-1 h-[1px] bg-gradient-to-l from-transparent to-[#b8873f]" />
            </div>

            <p className="text-[8px] sm:text-[9px] italic font-serif text-[#7c481e]">
              Crafted with Love • Served with Joy
            </p>
          </div>

          {/* =======================================================
              SECTION 2: BOTTOM 6" (66.67% height) - FRONT OF STAND (Upright)
              CAFE NAME + MENU + QR + COFFEE & PIZZA ELEMENTS
              ======================================================= */}
          <div className="w-full h-[66.67%] flex flex-col items-center justify-between py-5 px-4 relative z-10">
            {/* Visual badge hidden during print */}
            <span className="no-print text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              6" × 4" Stand Front (Upright)
            </span>

            {/* Cafe Name on Front Face */}
            <div className="text-center my-0.5">
              <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700 block">
                Welcome to
              </span>
              <h2
                className="text-xl sm:text-2xl font-black text-gray-900 leading-tight"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                {restaurant.name || 'Cafe Choco Craze'}
              </h2>
              <span className="text-[9.5px] italic font-serif text-[#92400e] tracking-wide block mt-0.5">
                Delicious Cold Coffee &nbsp;•&nbsp; Irresistibly Sweet
              </span>
            </div>

            {/* Hero MENU with Coffee & Pizza eye-pleasing elements */}
            <div className="flex items-center justify-center gap-3 my-0.5 w-full">
              {/* Coffee Icon */}
              <div className="w-7 h-7 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800 shrink-0 shadow-sm">
                <Coffee size={15} />
              </div>

              <h3
                className="text-3xl sm:text-4xl font-black tracking-widest text-[#1e130c] leading-none"
                style={{ fontFamily: 'Playfair Display, Georgia, serif' }}
              >
                MENU
              </h3>

              {/* Pizza Icon */}
              <div className="w-7 h-7 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 shrink-0 shadow-sm text-xs">
                🍕
              </div>
            </div>

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
              <span>☕ Cold Coffee</span>
              <span>•</span>
              <span>🍕 Pizza & Bites</span>
              <span>•</span>
              <span className="text-emerald-700 font-bold">🟢 Pure Veg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
