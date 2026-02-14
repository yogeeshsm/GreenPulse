import React from 'react';
import { MapPin, Factory, Award, Globe } from 'lucide-react';
import type { ProductData } from '@/types';

interface ProductHeaderProps {
  product: ProductData;
}

const ProductHeader: React.FC<ProductHeaderProps> = ({ product }) => {
  return (
    <div className="space-y-4">
      {/* Product Image & Basic Info */}
      <div className="flex items-start gap-4">
        {/* Product Image Placeholder */}
        <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-teal-500/20 via-blue-500/20 to-purple-500/20 flex items-center justify-center flex-shrink-0 border border-teal-500/20">
          <div className="text-center">
            <span className="text-3xl">🍫</span>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-bold text-white leading-tight mb-1">
            {product.name}
          </h1>
          <p className="text-lg text-teal-400 font-medium mb-2">
            {product.brand}
          </p>
          
          {/* Meta Info */}
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
              <Factory className="w-3 h-3" />
              {product.manufacturer}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
              <Globe className="w-3 h-3" />
              {product.country}
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 text-slate-400 text-xs">
              <MapPin className="w-3 h-3" />
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Certifications */}
      {product.certifications.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {product.certifications.map((cert, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full badge-eco text-xs font-medium"
            >
              <Award className="w-3 h-3" />
              {cert}
            </span>
          ))}
        </div>
      )}

      {/* Divider */}
      <div className="section-divider" />
    </div>
  );
};

export default ProductHeader;
