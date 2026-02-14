import React, { useState } from 'react';
import { Download, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import type { AnalysisResult } from '@/types';
import { getScoreLabel, getScoreColor } from '@/data/sampleData';
import jsPDF from 'jspdf';

interface ReportGeneratorProps {
  analysis: AnalysisResult;
}

const ReportGenerator: React.FC<ReportGeneratorProps> = ({ analysis }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const generatePDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    const contentWidth = pageWidth - margin * 2;
    let y = 15;

    const checkPage = (needed: number) => {
      if (y + needed > 280) {
        doc.addPage();
        y = 15;
      }
    };

    // ─── Header Banner ────────────────────────────────────────────
    doc.setFillColor(13, 148, 136); // teal-600
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setFillColor(20, 184, 166); // teal-500 accent
    doc.rect(0, 36, pageWidth, 4, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('Environmental Impact Report', margin, 18);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated: ${new Date().toLocaleString()}  |  Report ID: RPT-${Date.now().toString(36).toUpperCase()}`, margin, 28);
    doc.text('Powered by Eco Scanner AI', margin, 34);

    y = 50;

    // ─── Product Info Section ─────────────────────────────────────
    doc.setFillColor(240, 253, 250); // teal-50
    doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'F');
    doc.setDrawColor(13, 148, 136);
    doc.roundedRect(margin, y, contentWidth, 32, 3, 3, 'S');

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(analysis.product.name, margin + 5, y + 10);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Brand: ${analysis.product.brand}  |  Manufacturer: ${analysis.product.manufacturer}`, margin + 5, y + 18);
    doc.text(`Country: ${analysis.product.country}  |  Category: ${analysis.product.category}  |  Type: ${analysis.product.type}`, margin + 5, y + 25);

    y += 40;

    // ─── Sustainability Score ─────────────────────────────────────
    const scoreLabel = getScoreLabel(analysis.sustainableScore);
    const scoreColor = getScoreColor(analysis.sustainableScore);

    // Parse hex color to RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 };
    };

    const rgb = hexToRgb(scoreColor);

    doc.setFillColor(rgb.r, rgb.g, rgb.b);
    doc.roundedRect(margin, y, 50, 28, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`${analysis.sustainableScore}`, margin + 25, y + 14, { align: 'center' });
    doc.setFontSize(9);
    doc.text('/100', margin + 25, y + 22, { align: 'center' });

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Sustainability Rating: ${scoreLabel}`, margin + 56, y + 10);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`Data Confidence: ${analysis.dataConfidence}`, margin + 56, y + 17);
    doc.text(`Health Score: ${analysis.healthScore}/100  |  Carbon: ${analysis.carbonTotal} kg CO₂e  |  Water: ${analysis.waterTotal} L`, margin + 56, y + 24);

    y += 36;

    // ─── Score Breakdown ──────────────────────────────────────────
    const sectionTitle = (title: string) => {
      checkPage(20);
      doc.setFillColor(248, 250, 252);
      doc.rect(margin, y, contentWidth, 8, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.line(margin, y + 8, margin + contentWidth, y + 8);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 3, y + 6);
      y += 12;
    };

    sectionTitle('Score Breakdown');

    const breakdown = [
      { label: 'Carbon Impact', value: analysis.scoreBreakdown.carbon, max: 30 },
      { label: 'Water Usage', value: analysis.scoreBreakdown.water, max: 15 },
      { label: 'Energy Efficiency', value: analysis.scoreBreakdown.energy, max: 10 },
      { label: 'Ingredient Sustainability', value: analysis.scoreBreakdown.ingredientSustainability, max: 15 },
      { label: 'Health Score', value: analysis.scoreBreakdown.health, max: 10 },
      { label: 'Packaging', value: analysis.scoreBreakdown.packaging, max: 10 },
      { label: 'ESG Transparency', value: analysis.scoreBreakdown.esg, max: 10 },
    ];

    breakdown.forEach(item => {
      checkPage(8);
      doc.setTextColor(71, 85, 105);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(item.label, margin + 3, y + 4);

      // Progress bar
      const barX = margin + 60;
      const barWidth = 80;
      const barHeight = 4;
      const fillRatio = item.value / item.max;

      doc.setFillColor(226, 232, 240);
      doc.roundedRect(barX, y + 1, barWidth, barHeight, 2, 2, 'F');
      doc.setFillColor(rgb.r, rgb.g, rgb.b);
      doc.roundedRect(barX, y + 1, barWidth * fillRatio, barHeight, 2, 2, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.text(`${item.value}/${item.max}`, barX + barWidth + 4, y + 4);

      y += 7;
    });

    y += 5;

    // ─── AI Summary ─────────────────────────────────────────────
    sectionTitle('AI Analysis Summary');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const summaryLines = doc.splitTextToSize(analysis.aiSummary, contentWidth - 6);
    checkPage(summaryLines.length * 5 + 5);
    doc.text(summaryLines, margin + 3, y);
    y += summaryLines.length * 5 + 5;

    // ─── Packaging ──────────────────────────────────────────────
    sectionTitle('Packaging Information');
    const pkgInfo = [
      `Type: ${analysis.product.packaging.type}`,
      `Material: ${analysis.product.packaging.material}`,
      `Recyclability: ${analysis.product.packaging.recyclability}%`,
      `Disposal: ${analysis.product.packaging.instructions}`,
    ];
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    pkgInfo.forEach(line => {
      checkPage(6);
      doc.text(`•  ${line}`, margin + 5, y);
      y += 5;
    });
    y += 3;

    // ─── Disposal Guidance ──────────────────────────────────────
    sectionTitle('Disposal Guidance');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    checkPage(15);
    doc.text(`Classification: ${analysis.disposalGuidance.classification}`, margin + 5, y);
    y += 5;
    doc.text(`Recyclable: ${analysis.disposalGuidance.recyclable ? 'Yes' : 'No'}`, margin + 5, y);
    y += 5;
    const dispLines = doc.splitTextToSize(`Instructions: ${analysis.disposalGuidance.instructions}`, contentWidth - 10);
    doc.text(dispLines, margin + 5, y);
    y += dispLines.length * 5 + 3;

    // ─── Alternatives ───────────────────────────────────────────
    sectionTitle('Recommended Alternatives');
    analysis.alternatives.forEach((alt, i) => {
      checkPage(22);
      doc.setFillColor(i % 2 === 0 ? 248 : 255, i % 2 === 0 ? 250 : 255, i % 2 === 0 ? 252 : 255);
      doc.roundedRect(margin + 2, y - 2, contentWidth - 4, 20, 2, 2, 'F');

      doc.setTextColor(15, 23, 42);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}. ${alt.name} by ${alt.brand}`, margin + 5, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(71, 85, 105);
      doc.text(`Score: ${alt.sustainableScore}/100  |  Carbon Reduction: ${alt.carbonReduction}%`, margin + 9, y + 10);
      doc.text(`Packaging: ${alt.packagingImprovement}  |  Health: ${alt.healthImprovement}`, margin + 9, y + 15);
      y += 22;
    });

    y += 3;

    // ─── Certifications ─────────────────────────────────────────
    sectionTitle('Certifications');
    doc.setTextColor(51, 65, 85);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const certs = analysis.product.certifications.length > 0
      ? analysis.product.certifications.join(', ')
      : 'None listed';
    doc.text(certs, margin + 5, y);
    y += 8;

    // ─── Recommendation ─────────────────────────────────────────
    checkPage(25);
    const recMsg = analysis.sustainableScore >= 70
      ? 'This product is an environmentally responsible choice.'
      : analysis.sustainableScore >= 50
        ? 'This product has moderate impact. Consider alternatives for better sustainability.'
        : 'This product has high environmental impact. Switching to alternatives is strongly recommended.';

    const recColor = analysis.sustainableScore >= 70
      ? { r: 22, g: 163, b: 74 }
      : analysis.sustainableScore >= 50
        ? { r: 234, g: 179, b: 8 }
        : { r: 239, g: 68, b: 68 };

    doc.setFillColor(recColor.r, recColor.g, recColor.b);
    doc.roundedRect(margin, y, contentWidth, 14, 3, 3, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('RECOMMENDATION', margin + 5, y + 5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text(recMsg, margin + 5, y + 11);
    y += 20;

    // ─── Footer ───────────────────────────────────────────────
    const footerY = doc.internal.pageSize.getHeight() - 10;
    doc.setDrawColor(203, 213, 225);
    doc.line(margin, footerY - 5, margin + contentWidth, footerY - 5);
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.text('Eco Scanner • Environmental Impact Analysis Report • AI-Powered Sustainability Assessment', pageWidth / 2, footerY, { align: 'center' });

    // Save the PDF
    const fileName = `EcoReport_${analysis.product.name.replace(/\s+/g, '_')}_${Date.now()}.pdf`;
    doc.save(fileName);
  };

  const generateReport = async () => {
    setIsGenerating(true);

    try {
      // Small delay for UI feedback
      await new Promise(resolve => setTimeout(resolve, 500));
      generatePDF();
      setIsComplete(true);
      setTimeout(() => setIsComplete(false), 3000);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 border-teal-500/30 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300"
        >
          <FileText className="w-4 h-4" />
          Generate Report
        </Button>
      </DialogTrigger>

      <DialogContent className="glass-panel border-teal-500/20 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            Download Analysis Report
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Generate a comprehensive PDF sustainability report for this product.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Report Preview */}
          <div className="p-4 bg-slate-900/50 rounded-lg border border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Product</span>
              <span className="text-sm text-white font-medium truncate max-w-[200px]">
                {analysis.product.name}
              </span>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">Score</span>
              <span
                className="text-sm font-bold"
                style={{ color: getScoreColor(analysis.sustainableScore) }}
              >
                {analysis.sustainableScore}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Format</span>
              <span className="text-sm text-white flex items-center gap-1">
                <FileText className="w-3 h-3 text-red-400" />
                PDF Document
              </span>
            </div>
          </div>

          {/* Includes List */}
          <div className="space-y-2">
            <p className="text-sm text-slate-400">Report includes:</p>
            <ul className="space-y-1">
              {[
                'Complete product information',
                'Sustainability score with breakdown bars',
                'Environmental metrics (Carbon, Water, Health)',
                'AI analysis summary',
                'Packaging & disposal guidance',
                'Alternative recommendations',
                'Overall recommendation'
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle className="w-4 h-4 text-teal-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <Button
          onClick={generateReport}
          disabled={isGenerating || isComplete}
          className="w-full eco-button text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating PDF...
            </>
          ) : isComplete ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              PDF Downloaded!
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Download PDF Report
            </>
          )}
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default ReportGenerator;
