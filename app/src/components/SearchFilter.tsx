
import { useState } from 'react';
import { Search, SlidersHorizontal, X, Filter, Leaf, Factory, Globe, Scan, Camera, Upload, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { ProductData } from '@/types';
import BarcodeScanner from './BarcodeScanner';
import ImageUploader from './ImageUploader';
import { analyzeProductFromImage, analyzeProductFromBarcode } from '@/services/aiService';

interface SearchFilterProps {
  products: ProductData[];
  onSelectProduct: (product: ProductData) => void;
}

const SearchFilter = ({ products, onSelectProduct }: SearchFilterProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showEcoOnly, setShowEcoOnly] = useState(false);
  const [activeTab, setActiveTab] = useState('search');

  // Scanning States
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const categories = [...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesEco = !showEcoOnly || product.certifications.length > 0;

    return matchesSearch && matchesCategory && matchesEco;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setShowEcoOnly(false);
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || showEcoOnly;

  // Handlers for AI/Scan
  const handleImageSelected = async (base64: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const result = await analyzeProductFromImage(base64);
      if (result) {
        onSelectProduct(result.product);
        setIsOpen(false);
      } else {
        setError("Could not identify product. Please try again.");
      }
    } catch (err) {
      setError("AI Analysis failed. Check API key or try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleBarcodeDetected = async (code: string) => {
    // Prevent multiple calls
    if (isAnalyzing) return;

    setIsAnalyzing(true);
    setError(null);
    try {
      // First check local products
      // const localMatch = products.find(p => p.id === code); 
      // if (localMatch) { ... }

      // If not found locally, ask AI
      const result = await analyzeProductFromBarcode(code);
      if (result) {
        onSelectProduct(result.product);
        setIsOpen(false);
      } else {
        setError(`Product with barcode ${code} not found.`);
      }
    } catch (err) {
      setError("Barcode lookup failed.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="glass-panel border-green-500/30 text-green-400 hover:bg-green-500/10 gap-2"
      >
        <Search className="w-4 h-4" />
        Search / Scan
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-green-500/20 max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Scan className="w-5 h-5 text-green-400" />
              Find Product
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
            <TabsList className="grid w-full grid-cols-4 bg-slate-800/50 p-1 mb-4">
              <TabsTrigger value="barcode" className="gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                <Scan className="w-4 h-4" /> <span className="hidden sm:inline">Barcode</span>
              </TabsTrigger>
              <TabsTrigger value="camera" className="gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                <Camera className="w-4 h-4" /> <span className="hidden sm:inline">Camera</span>
              </TabsTrigger>
              <TabsTrigger value="upload" className="gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Upload</span>
              </TabsTrigger>
              <TabsTrigger value="search" className="gap-2 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400">
                <Search className="w-4 h-4" /> <span className="hidden sm:inline">Search</span>
              </TabsTrigger>
            </TabsList>

            {/* ERROR ALERT */}
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-400 text-sm animate-shake">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* CONTENT */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <TabsContent value="barcode" className="mt-0 h-full">
                <div className="flex flex-col items-center justify-center h-full py-4">
                  {isAnalyzing ? (
                    <div className="space-y-4 text-center">
                      <Loader2 className="w-10 h-10 text-teal-400 animate-spin mx-auto" />
                      <p className="text-slate-300">Looking up product...</p>
                    </div>
                  ) : (
                    <BarcodeScanner
                      onScanSuccess={handleBarcodeDetected}
                      onClose={() => setActiveTab('search')}
                    />
                  )}
                </div>
              </TabsContent>

              <TabsContent value="camera" className="mt-0 h-full">
                <div className="h-full flex flex-col justify-center">
                  <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    <h3 className="text-center text-slate-300 mb-4">Take a photo of the product</h3>
                    <ImageUploader isLoading={isAnalyzing} onImageSelected={handleImageSelected} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="upload" className="mt-0 h-full">
                <div className="h-full flex flex-col justify-center">
                  <div className="p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
                    <h3 className="text-center text-slate-300 mb-4">Upload an image from your device</h3>
                    <ImageUploader isLoading={isAnalyzing} onImageSelected={handleImageSelected} />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="search" className="mt-0 h-full space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    placeholder="Search by name or brand..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/50">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-400">Filters:</span>
                  </div>

                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => toggleCategory(category)}
                      className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCategories.includes(category)
                        ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                        : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                        }`}
                    >
                      {category}
                    </button>
                  ))}

                  <button
                    onClick={() => setShowEcoOnly(!showEcoOnly)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1 ${showEcoOnly
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700/50'
                      }`}
                  >
                    <Leaf className="w-3 h-3" />
                    Eco-Certified
                  </button>

                  {hasActiveFilters && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-1.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {/* Results Count */}
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-400">
                    {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
                  </p>
                </div>

                {/* Results List */}
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-2">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-8">
                        <Search className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                        <p className="text-slate-400">No products found</p>
                        <p className="text-sm text-slate-500">Try adjusting your filters</p>
                      </div>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            onSelectProduct(product);
                            setIsOpen(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl hover:bg-slate-700/50 transition-colors text-left animate-fade-in-up"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          {/* Product Icon */}
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0">
                            <span className="text-xl">
                              {product.category === 'Dairy Alternative' ? '🥛' :
                                product.category === 'Meat' ? '🍖' :
                                  product.category === 'Coffee' ? '☕' :
                                    product.category === 'Plant-Based Meat' ? '🌱' :
                                      product.category === 'Breakfast Cereal' ? '🥣' : '🍫'}
                            </span>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-white truncate">{product.name}</p>
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Factory className="w-3 h-3" />
                              {product.brand}
                              <span className="text-slate-600">•</span>
                              <Globe className="w-3 h-3" />
                              {product.country}
                            </div>
                          </div>

                          {/* Certifications */}
                          <div className="flex items-center gap-1">
                            {product.certifications.slice(0, 2).map((cert, i) => (
                              <span key={i} className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 text-xs">
                                {cert}
                              </span>
                            ))}
                            {product.certifications.length > 2 && (
                              <span className="text-slate-400 text-xs">+{product.certifications.length - 2}</span>
                            )}
                          </div>

                          {/* Arrow */}
                          <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                        </button>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </div>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchFilter;
