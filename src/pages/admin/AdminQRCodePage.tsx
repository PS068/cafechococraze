import QRCodeCard from '../../components/admin/QRCodeCard';

export default function AdminQRCodePage() {
  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="no-print">
        <h1
          className="text-2xl sm:text-3xl font-bold tracking-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
        >
          QR Code & Table Tents
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
          Generate, download, and print physical QR cards for dining tables. Customers can scan without downloading any app.
        </p>
      </div>

      <QRCodeCard />
    </div>
  );
}
