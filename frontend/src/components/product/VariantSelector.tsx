'use client';

import { ProductVariant } from '@/types';
import { cn } from '@/lib/utils';

interface VariantSelectorProps {
  variants: ProductVariant[];
  selectedSize: string | null;
  selectedColor: string | null;
  onSizeChange: (size: string) => void;
  onColorChange: (color: string) => void;
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

export default function VariantSelector({
  variants,
  selectedSize,
  selectedColor,
  onSizeChange,
  onColorChange,
}: VariantSelectorProps) {
  const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L'];
  const sizes = unique(variants.map(v => v.size))
    .filter(s => SIZE_ORDER.includes(s))
    .sort((a, b) => SIZE_ORDER.indexOf(a) - SIZE_ORDER.indexOf(b));
  const colors = unique(variants.map(v => v.color));

  function isSizeAvailable(size: string) {
    // If a color is already selected, only show sizes available in that color
    if (selectedColor) {
      return variants.some(v => v.size === size && v.color === selectedColor && v.stock > 0);
    }
    return variants.some(v => v.size === size && v.stock > 0);
  }

  function isColorAvailable(color: string) {
    // If a size is already selected, only show colors available in that size
    if (selectedSize) {
      return variants.some(v => v.color === color && v.size === selectedSize && v.stock > 0);
    }
    return variants.some(v => v.color === color && v.stock > 0);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Size selector */}
      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium text-[#111111] mb-3">
            Size
            {selectedSize && (
              <span className="ml-2 text-[#8C8880] font-normal">— {selectedSize}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(size => {
              const available = isSizeAvailable(size);
              const active = selectedSize === size;
              return (
                <button
                  key={size}
                  onClick={() => onSizeChange(size)}
                  disabled={!available}
                  className={cn(
                    'min-w-[44px] px-4 py-2 rounded-full text-sm font-medium border transition-all duration-150',
                    active
                      ? 'bg-[#111111] text-white border-[#111111]'
                      : 'bg-white text-[#111111] border-[#E8E4DF] hover:border-[#111111]',
                    !available && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color selector */}
      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium text-[#111111] mb-3">
            Color
            {selectedColor && (
              <span className="ml-2 text-[#8C8880] font-normal">— {selectedColor}</span>
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            {colors.map(color => {
              const available = isColorAvailable(color);
              const active = selectedColor === color;
              return (
                <button
                  key={color}
                  onClick={() => onColorChange(color)}
                  disabled={!available}
                  title={color}
                  className={cn(
                    'w-8 h-8 rounded-full border-2 transition-all duration-150',
                    active
                      ? 'border-[#111111] scale-110'
                      : 'border-transparent hover:border-[#8C8880]',
                    !available && 'opacity-40 cursor-not-allowed'
                  )}
                  style={{ backgroundColor: color.toLowerCase() }}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
