import { useState, useEffect } from 'react';
import { History, Clock, Trash2, TrendingUp, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import type { ProductData } from '@/types';
import { getScoreColor } from '@/data/sampleData';
import { scanHistoryItems, additionalProducts } from '@/data/extendedData';

interface ScanHistoryProps {
  currentProduct: ProductData;
}

interface HistoryItem {
  id: string;
  product: ProductData;
  scannedAt: string;
  score: number;
}

const ScanHistory = ({ currentProduct }: ScanHistoryProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Combine current product with history
    const allProducts = [currentProduct, ...additionalProducts];
    const items: HistoryItem[] = scanHistoryItems.map(item => {
      const product = allProducts.find(p => p.id === item.productId) || currentProduct;
      return {
        id: item.id,
        product,
        scannedAt: item.scannedAt,
        score: item.score
      };
    });
    setHistory(items);
  }, [currentProduct]);

  const filteredHistory = history.filter(item =>
    item.product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const deleteItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const averageScore = history.length > 0 
    ? Math.round(history.reduce((acc, item) => acc + item.score, 0) / history.length)
    : 0;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
      >
        <History className="w-4 h-4" />
        History
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-purple-500/20 max-w-2xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <History className="w-5 h-5 text-purple-400" />
              Scan History
            </DialogTitle>
          </DialogHeader>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-white">{history.length}</p>
              <p className="text-xs text-slate-400">Total Scans</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold" style={{ color: getScoreColor(averageScore) }}>
                {averageScore}
              </p>
              <p className="text-xs text-slate-400">Avg Score</p>
            </div>
            <div className="p-3 bg-slate-800/50 rounded-xl text-center">
              <p className="text-2xl font-bold text-green-400">
                {history.filter(i => i.score >= 70).length}
              </p>
              <p className="text-xs text-slate-400">Eco-Friendly</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
            />
          </div>

          {/* History List */}
          <ScrollArea className="max-h-[50vh]">
            <div className="space-y-2">
              {filteredHistory.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No scan history found</p>
                </div>
              ) : (
                filteredHistory.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors group animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Product Icon */}
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">
                        {item.product.category === 'Dairy Alternative' ? '🥛' :
                         item.product.category === 'Meat' ? '🍖' :
                         item.product.category === 'Coffee' ? '☕' :
                         item.product.category === 'Plant-Based Meat' ? '🌱' :
                         item.product.category === 'Breakfast Cereal' ? '🥣' : '🍫'}
                      </span>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white truncate">{item.product.name}</p>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {formatDate(item.scannedAt)}
                      </div>
                    </div>

                    {/* Score */}
                    <div 
                      className="px-3 py-1 rounded-full text-sm font-bold"
                      style={{ 
                        backgroundColor: `${getScoreColor(item.score)}20`,
                        color: getScoreColor(item.score)
                      }}
                    >
                      {item.score}
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => deleteItem(item.id)}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Footer */}
          {history.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <TrendingUp className="w-4 h-4" />
                <span>Your sustainability awareness is improving!</span>
              </div>
              <Button
                onClick={clearHistory}
                variant="ghost"
                size="sm"
                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanHistory;
