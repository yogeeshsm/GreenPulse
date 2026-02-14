// GreenPulse QR Share Modal
// Displays a QR code with the user's daily sustainability data

import { useRef, useCallback, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, Share2, Copy, Check, FileText, QrCode } from 'lucide-react';
import type { DaySession, ActivityLog } from '@/types';
import {
  generateDailyQRPayload,
  encodeQRPayload,
  generateShareText,
  generateHTMLReport,
} from '@/lib/qrEngine';

interface QRShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  daySession: DaySession;
  activities: ActivityLog[];
}

export function QRShareModal({
  isOpen,
  onClose,
  daySession,
  activities,
}: QRShareModalProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'report'>('qr');

  // Generate QR payload
  const payload = generateDailyQRPayload(daySession, activities);
  const qrUrl = encodeQRPayload(payload);
  const shareText = generateShareText(payload);

  const handleCopyText = useCallback(() => {
    navigator.clipboard.writeText(shareText).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [shareText]);

  const handleNativeShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: `GreenPulse Report - ${daySession.date}`,
        text: shareText,
        url: qrUrl,
      });
    }
  }, [shareText, qrUrl, daySession.date]);

  const handleDownloadQR = useCallback(() => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = 400;
      canvas.height = 400;
      if (ctx) {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, 400, 400);
        ctx.drawImage(img, 0, 0, 400, 400);

        const pngUrl = canvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = pngUrl;
        a.download = `greenpulse-qr-${daySession.date}.png`;
        a.click();
      }
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  }, [daySession.date]);

  const handleExportHTMLReport = useCallback(() => {
    // Get QR as data URL for embedding
    let qrDataUrl = '';
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        qrDataUrl = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }

    const html = generateHTMLReport(daySession, activities, qrDataUrl);
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `greenpulse-report-${daySession.date}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [daySession, activities]);

  const handlePrintReport = useCallback(() => {
    let qrDataUrl = '';
    if (qrRef.current) {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        qrDataUrl = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }

    const html = generateHTMLReport(daySession, activities, qrDataUrl);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      setTimeout(() => printWindow.print(), 500);
    }
  }, [daySession, activities]);

  if (!isOpen) return null;

  const { totals } = daySession;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#22C55E] rounded-xl flex items-center justify-center">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Share & Export</h2>
              <p className="text-xs text-gray-500">{daySession.date}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex gap-2 p-4 border-b border-gray-100">
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'qr'
                ? 'bg-[#22C55E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <QrCode className="w-4 h-4" />
            QR Code
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium text-sm transition-all ${
              activeTab === 'report'
                ? 'bg-[#22C55E] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            Full Report
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'qr' ? (
            <>
              {/* QR Code Display */}
              <div className="text-center mb-6">
                <div
                  ref={qrRef}
                  className="inline-block p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-sm"
                >
                  <QRCodeSVG
                    value={qrUrl}
                    size={200}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#1a1a1a"
                    includeMargin={false}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Scan to verify this report's data
                </p>
              </div>

              {/* Quick Stats in QR view */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <p className="text-xl font-bold text-gray-900">{daySession.dailyScore}</p>
                  <p className="text-[10px] text-gray-500">Score</p>
                </div>
                <div className="text-center p-3 bg-emerald-50 rounded-xl">
                  <p className="text-xl font-bold text-[#22C55E]">
                    {totals.avoidedCo2eKg.toFixed(1)}
                  </p>
                  <p className="text-[10px] text-gray-500">kg saved</p>
                </div>
                <div className="text-center p-3 bg-amber-50 rounded-xl">
                  <p className="text-xl font-bold text-amber-600">{totals.greenPoints}</p>
                  <p className="text-[10px] text-gray-500">Points</p>
                </div>
              </div>

              {/* Share Text Preview */}
              <div className="p-4 bg-gray-50 rounded-xl mb-4">
                <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
                  {shareText}
                </pre>
              </div>

              {/* QR Actions */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={handleDownloadQR}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
                >
                  <Download className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] font-medium text-gray-600">Save QR</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
                >
                  {copied ? (
                    <Check className="w-5 h-5 text-[#22C55E]" />
                  ) : (
                    <Copy className="w-5 h-5 text-gray-600" />
                  )}
                  <span className="text-[11px] font-medium text-gray-600">
                    {copied ? 'Copied!' : 'Copy Text'}
                  </span>
                </button>
                <button
                  onClick={handleNativeShare}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl border-2 border-gray-200 hover:border-[#22C55E] hover:bg-[#22C55E]/5 transition-all"
                >
                  <Share2 className="w-5 h-5 text-gray-600" />
                  <span className="text-[11px] font-medium text-gray-600">Share</span>
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Report Preview */}
              <div className="space-y-4 mb-6">
                {/* Mini report card */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-[#22C55E] rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">GP</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Daily Report</h3>
                      <p className="text-xs text-gray-500">{daySession.date}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="p-3 bg-white/80 rounded-lg">
                      <p className="text-xs text-gray-500">Score</p>
                      <p className="text-lg font-bold text-gray-900">{daySession.dailyScore}/100</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-lg">
                      <p className="text-xs text-gray-500">CO₂e Emitted</p>
                      <p className="text-lg font-bold text-gray-900">{totals.co2eKg.toFixed(2)} kg</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-lg">
                      <p className="text-xs text-gray-500">CO₂e Avoided</p>
                      <p className="text-lg font-bold text-[#22C55E]">{totals.avoidedCo2eKg.toFixed(2)} kg</p>
                    </div>
                    <div className="p-3 bg-white/80 rounded-lg">
                      <p className="text-xs text-gray-500">Green Points</p>
                      <p className="text-lg font-bold text-amber-600">{totals.greenPoints}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm font-medium text-gray-700">{totals.kwh.toFixed(1)}</p>
                      <p className="text-[10px] text-gray-500">kWh</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{totals.waterLiters} L</p>
                      <p className="text-[10px] text-gray-500">Water</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{totals.wasteDiverted}</p>
                      <p className="text-[10px] text-gray-500">Waste diverted</p>
                    </div>
                  </div>
                </div>

                {/* Activities count */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Activities tracked</span>
                  <span className="font-semibold text-gray-900">{activities.length}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <span className="text-sm text-gray-600">Streak</span>
                  <span className="font-semibold text-gray-900">{daySession.streakDays} days 🔥</span>
                </div>

                <p className="text-xs text-gray-400 text-center">
                  Full HTML report includes detailed activity log, stats, and embedded QR code
                </p>
              </div>

              {/* Report Actions */}
              <div className="space-y-3">
                <button
                  onClick={handleExportHTMLReport}
                  className="w-full py-3 px-4 rounded-xl bg-[#22C55E] text-white font-medium hover:bg-[#16A34A] transition-all flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download HTML Report
                </button>
                <button
                  onClick={handlePrintReport}
                  className="w-full py-3 px-4 rounded-xl border-2 border-[#22C55E] text-[#22C55E] font-medium hover:bg-[#22C55E]/10 transition-all flex items-center justify-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  Print / Save as PDF
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
