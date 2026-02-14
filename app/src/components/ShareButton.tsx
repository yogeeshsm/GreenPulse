import { useState } from 'react';
import { Share2, Link, Check, Twitter, Facebook, Linkedin, Mail, Download, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { AnalysisResult } from '@/types';
import { getScoreColor, getScoreLabel } from '@/data/sampleData';

interface ShareButtonProps {
  analysis: AnalysisResult;
}

const ShareButton = ({ analysis }: ShareButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareText = `I scanned ${analysis.product.name} with EcoScan!\n\nSustainable Score: ${analysis.sustainableScore}/100 (${getScoreLabel(analysis.sustainableScore)})\n\nCarbon: ${analysis.carbonTotal}kg CO₂e | Water: ${analysis.waterTotal}L\n\nCheck your products at ecoscan.app`;

  const shareUrl = `https://ecoscan.app/product/${analysis.product.id}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500/20 text-sky-400 hover:bg-sky-500/30',
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')
    },
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30',
      action: () => window.open(`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'bg-blue-700/20 text-blue-400 hover:bg-blue-700/30',
      action: () => window.open(`https://linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-red-500/20 text-red-400 hover:bg-red-500/30',
      action: () => window.open(`mailto:?subject=Check out this product scan&body=${encodeURIComponent(shareText)}`, '_blank')
    }
  ];

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10"
      >
        <Share2 className="w-4 h-4" />
        Share
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-cyan-500/20 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Share2 className="w-5 h-5 text-cyan-400" />
              Share Results
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Preview Card */}
            <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center">
                  <span className="text-lg">🍫</span>
                </div>
                <div>
                  <p className="font-medium text-white text-sm">{analysis.product.name}</p>
                  <p className="text-xs text-slate-400">{analysis.product.brand}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-400">Sustainable Score</span>
                <span 
                  className="text-lg font-bold"
                  style={{ color: getScoreColor(analysis.sustainableScore) }}
                >
                  {analysis.sustainableScore}/100
                </span>
              </div>
            </div>

            {/* Social Share Options */}
            <div className="grid grid-cols-4 gap-2">
              {shareOptions.map((option) => (
                <button
                  key={option.name}
                  onClick={option.action}
                  className={`p-3 rounded-xl transition-colors ${option.color}`}
                >
                  <option.icon className="w-5 h-5 mx-auto" />
                  <span className="text-xs mt-1 block">{option.name}</span>
                </button>
              ))}
            </div>

            {/* Copy Options */}
            <div className="space-y-2">
              <button
                onClick={handleCopyLink}
                className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Link className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">Copy Link</span>
                </div>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>

              <button
                onClick={handleCopyText}
                className="w-full flex items-center justify-between p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Download className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-white">Copy as Text</span>
                </div>
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              </button>
            </div>

            {/* Encouragement */}
            <p className="text-center text-sm text-slate-400">
              Spread awareness about sustainable choices! 🌱
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareButton;
