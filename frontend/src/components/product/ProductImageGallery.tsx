'use client';

import { useState } from 'react';
import Image from 'next/image';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800';

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const allImages = images.length > 0 ? images : [PLACEHOLDER];
  const [selected, setSelected] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main image */}
      <div className="relative overflow-hidden rounded-xl" style={{ aspectRatio: '4/5' }}>
        <Image
          src={allImages[selected]}
          alt={productName}
          fill
          priority
          loading="eager"
          sizes="(max-width: 768px) 100vw, 60vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {allImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 w-20 rounded-lg overflow-hidden transition-all ${
                selected === i
                  ? 'ring-2 ring-[#111111]'
                  : 'ring-1 ring-[#E8E4DF] opacity-60 hover:opacity-100'
              }`}
              style={{ aspectRatio: '1/1' }}
            >
              <Image
                src={img}
                alt={`${productName} view ${i + 1}`}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
