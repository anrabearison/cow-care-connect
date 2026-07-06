import { useMemo, useState } from 'react';
import type React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Cattle } from '@/features/cattle/types';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';

const fallbackImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

interface CattlePhotoCarouselProps {
  cattle: Cattle;
  className?: string;
  imageClassName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export function getCattlePrimaryImage(cattle: Cattle) {
  const orderedPhotos = (cattle.photos || []).slice().sort((a, b) => a.position - b.position);
  const primaryPhoto = orderedPhotos.find(photo => photo.isPrimary) || orderedPhotos[0];
  if (primaryPhoto?.url) return primaryPhoto.url;
  if (cattle.photo) return cattle.photo;

  const idHash = cattle.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackImages[idHash % fallbackImages.length];
}

export function CattlePhotoCarousel({ cattle, className = '', imageClassName = '', onClick }: CattlePhotoCarouselProps) {
  const images = useMemo(() => {
    const photos = (cattle.photos || [])
      .slice()
      .sort((a, b) => a.position - b.position)
      .map(photo => photo.url)
      .filter(Boolean);

    if (photos.length > 0) return photos;
    return [getCattlePrimaryImage(cattle)];
  }, [cattle]);

  const [index, setIndex] = useState(0);
  const currentImage = images[Math.min(index, images.length - 1)];
  const hasMultipleImages = images.length > 1;

  return (
    <div className={`relative overflow-hidden ${className}`} onClick={onClick}>
      <img
        src={currentImage}
        alt={`Photo de ${cattle.name}`}
        className={`h-full w-full object-cover ${imageClassName}`}
        loading="lazy"
        decoding="async"
      />
      {hasMultipleImages && (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/85 hover:bg-white"
            onClick={(event) => {
              event.preventDefault();
              setIndex(value => (value === 0 ? images.length - 1 : value - 1));
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 bg-white/85 hover:bg-white"
            onClick={(event) => {
              event.preventDefault();
              setIndex(value => (value + 1) % images.length);
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
            {images.map((image, imageIndex) => (
              <span
                key={`${image}-${imageIndex}`}
                className={`h-1.5 w-1.5 rounded-full ${imageIndex === index ? 'bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
