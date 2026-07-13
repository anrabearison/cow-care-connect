import type React from 'react';
import { Cattle } from '@/features/cattle/types';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';

const fallbackImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

export interface CattlePhotoCarouselProps {
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
