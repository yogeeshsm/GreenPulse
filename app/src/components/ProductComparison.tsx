import { useState } from 'react';
import { X, Plus, ArrowRightLeft, Check, XCircle, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { ProductData } from '@/types';
import { getScoreColor } from '@/data/sampleData';

interface ProductComparisonProps {
  products: ProductData[];
  currentProduct: ProductData;
}

interface ComparisonProduct {
  product: ProductData;
  score: number;
}

const ProductComparison = ({ products, currentProduct }: ProductComparisonProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<ComparisonProduct[]>([
    { product: currentProduct, score: 62 }
  ]);

  const availableProducts = products.filter(p =>
    !selectedProducts.some(sp => sp.product.id === p.id)
  );

  const addProduct = (product: ProductData) => {
    if (selectedProducts.length < 3) {
      // Calculate mock score based on product data
      const score = Math.floor(Math.random() * 40) + 50;
      setSelectedProducts([...selectedProducts, { product, score }]);
    }
  };

  const removeProduct = (productId: string) => {
    if (selectedProducts.length > 1) {
      setSelectedProducts(selectedProducts.filter(p => p.product.id !== productId));
    }
  };

  const getComparisonIcon = (value1: number, value2: number, lowerIsBetter = true) => {
    if (value1 === value2) return <Minus className="w-4 h-4 text-slate-400" />;
    const better = lowerIsBetter ? value1 < value2 : value1 > value2;
    return better ? (
      <Check className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
      >
        <ArrowRightLeft className="w-4 h-4" />
        Compare Products
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="glass-panel border-teal-500/20 max-w-5xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-teal-400" />
              Product Comparison
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6">
              {/* Product Selector */}
              {selectedProducts.length < 3 && (
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <p className="text-sm text-slate-400 mb-3">Add products to compare (max 3):</p>
                  <div className="flex flex-wrap gap-2">
                    {availableProducts.map(product => (
                      <button
                        key={product.id}
                        onClick={() => addProduct(product)}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-700 hover:bg-teal-500/20 text-sm text-slate-300 hover:text-teal-400 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        {product.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Comparison Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left p-3 text-slate-400 font-medium">Feature</th>
                      {selectedProducts.map(({ product, score }) => (
                        <th key={product.id} className="p-3 text-center min-w-[180px]">
                          <div className="relative">
                            {selectedProducts.length > 1 && (
                              <button
                                onClick={() => removeProduct(product.id)}
                                className="absolute -top-2 -right-2 p-1 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-teal-500/20 to-blue-500/20 flex items-center justify-center mb-2">
                              <span className="text-xl">
                                {product.category === 'Dairy Alternative' ? '🥛' :
                                  product.category === 'Meat' ? '🍖' :
                                    product.category === 'Coffee' ? '☕' :
                                      product.category === 'Plant-Based Meat' ? '🌱' :
                                        product.category === 'Breakfast Cereal' ? '🥣' : '🍫'}
                              </span>
                            </div>
                            <p className="text-white font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-slate-400">{product.brand}</p>
                            <div
                              className="mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-bold"
                              style={{
                                backgroundColor: `${getScoreColor(score)}20`,
                                color: getScoreColor(score)
                              }}
                            >
                              Score: {score}
                            </div>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {/* Carbon */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">Carbon (kg CO₂e)</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white">
                              {product.ingredients?.reduce((acc, i) => acc + i.carbonIntensity * (i.percentage / 100), 0).toFixed(1) || 'N/A'}
                            </span>
                            {selectedProducts.length > 1 && product.ingredients && selectedProducts[0].product.ingredients && getComparisonIcon(
                              product.ingredients.reduce((acc, i) => acc + i.carbonIntensity * (i.percentage / 100), 0),
                              selectedProducts[0].product.ingredients.reduce((acc, i) => acc + i.carbonIntensity * (i.percentage / 100), 0)
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Water */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">Water (liters)</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white">
                              {product.ingredients ? Math.round(product.ingredients.reduce((acc, i) => acc + i.waterIntensity * (i.percentage / 100), 0)) : 'N/A'}
                            </span>
                            {selectedProducts.length > 1 && product.ingredients && selectedProducts[0].product.ingredients && getComparisonIcon(
                              product.ingredients.reduce((acc, i) => acc + i.waterIntensity * (i.percentage / 100), 0),
                              selectedProducts[0].product.ingredients.reduce((acc, i) => acc + i.waterIntensity * (i.percentage / 100), 0)
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Packaging */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">Packaging Recyclability</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white">{product.packaging.recyclability}%</span>
                            {selectedProducts.length > 1 && getComparisonIcon(
                              100 - product.packaging.recyclability,
                              100 - selectedProducts[0].product.packaging.recyclability
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Sugar */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">Sugar Content</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-white">{product.nutrition?.sugar ?? 'N/A'}g</span>
                            {selectedProducts.length > 1 && product.nutrition && selectedProducts[0].product.nutrition && getComparisonIcon(
                              product.nutrition.sugar,
                              selectedProducts[0].product.nutrition.sugar
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* ESG */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">ESG Transparency</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <span className={`font-medium ${product.esg.transparencyScore >= 70 ? 'text-green-400' : product.esg.transparencyScore >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                              {product.esg.transparencyScore}%
                            </span>
                            {selectedProducts.length > 1 && getComparisonIcon(
                              product.esg.transparencyScore,
                              selectedProducts[0].product.esg.transparencyScore,
                              false
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>

                    {/* Certifications */}
                    <tr className="border-t border-white/10">
                      <td className="p-3 text-slate-400">Certifications</td>
                      {selectedProducts.map(({ product }) => (
                        <td key={product.id} className="p-3 text-center">
                          <div className="flex flex-wrap justify-center gap-1">
                            {product.certifications.length > 0 ? (
                              product.certifications.slice(0, 2).map((cert, i) => (
                                <span key={i} className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 text-xs">
                                  {cert}
                                </span>
                              ))
                            ) : (
                              <span className="text-slate-500 text-xs">None</span>
                            )}
                            {product.certifications.length > 2 && (
                              <span className="text-slate-400 text-xs">+{product.certifications.length - 2}</span>
                            )}
                          </div>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Winner Banner */}
              {selectedProducts.length > 1 && (
                <div className="p-4 bg-gradient-to-r from-green-500/20 to-teal-500/20 rounded-xl border border-green-500/30">
                  <p className="text-center text-green-400 font-medium">
                    🏆 Best Choice: {selectedProducts.reduce((best, current) =>
                      current.score > best.score ? current : best
                    ).product.name}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProductComparison;
