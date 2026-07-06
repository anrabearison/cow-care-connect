import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ImagePlus, Loader2, Star, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { uploadService } from '@/features/common/services/uploadService';

export interface CattlePhotoInputValue {
  id?: string;
  url: string;
  publicId?: string;
  position: number;
  isPrimary: boolean;
}

interface CattlePhotosInputProps {
  value: CattlePhotoInputValue[];
  onChange: (photos: CattlePhotoInputValue[]) => void;
  disabled?: boolean;
}

const MAX_PHOTOS = 5;

const normalizePhotos = (photos: CattlePhotoInputValue[]) => {
  const normalized = photos.slice(0, MAX_PHOTOS).map((photo, index) => ({
    ...photo,
    position: index,
    isPrimary: photo.isPrimary,
  }));

  if (normalized.length > 0 && !normalized.some(photo => photo.isPrimary)) {
    normalized[0].isPrimary = true;
  }

  let primarySeen = false;
  return normalized.map(photo => {
    if (photo.isPrimary && !primarySeen) {
      primarySeen = true;
      return photo;
    }
    return { ...photo, isPrimary: false };
  });
};

export function CattlePhotosInput({ value, onChange, disabled }: CattlePhotosInputProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos = normalizePhotos(value);
  const currentPhoto = photos[currentIndex] || photos[0];
  const canAdd = photos.length < MAX_PHOTOS && !disabled;

  const updatePhotos = (nextPhotos: CattlePhotoInputValue[]) => {
    const normalized = normalizePhotos(nextPhotos);
    onChange(normalized);
    setCurrentIndex(index => Math.min(index, Math.max(normalized.length - 1, 0)));
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remainingSlots = MAX_PHOTOS - photos.length;
    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    if (selectedFiles.length < files.length) {
      toast({
        title: 'Limite atteinte',
        description: `Vous pouvez ajouter au maximum ${MAX_PHOTOS} photos par bovin.`,
      });
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(selectedFiles.map(file => uploadService.uploadImage(file)));
      const nextPhotos = [
        ...photos,
        ...uploaded.map((photo, index) => ({
          url: photo.url,
          publicId: photo.publicId,
          position: photos.length + index,
          isPrimary: photos.length === 0 && index === 0,
        })),
      ];
      updatePhotos(nextPhotos);
    } catch (error) {
      console.error('Error uploading cattle photos:', error);
      toast({
        title: 'Erreur',
        description: "Impossible d'uploader les photos du bovin.",
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    }
  };

  const moveCurrent = (direction: -1 | 1) => {
    const nextIndex = currentIndex + direction;
    if (nextIndex < 0 || nextIndex >= photos.length) return;

    const nextPhotos = [...photos];
    const [photo] = nextPhotos.splice(currentIndex, 1);
    nextPhotos.splice(nextIndex, 0, photo);
    updatePhotos(nextPhotos);
    setCurrentIndex(nextIndex);
  };

  const removeCurrent = () => {
    if (!currentPhoto) return;
    updatePhotos(photos.filter((_, index) => index !== currentIndex));
  };

  const setPrimary = () => {
    if (!currentPhoto) return;
    updatePhotos(photos.map((photo, index) => ({ ...photo, isPrimary: index === currentIndex })));
  };

  const showPrevious = () => setCurrentIndex(index => Math.max(index - 1, 0));
  const showNext = () => setCurrentIndex(index => Math.min(index + 1, photos.length - 1));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div>
          <Label>Photos du bovin</Label>
          <p className="text-xs text-muted-foreground">{photos.length} / {MAX_PHOTOS} photos</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!canAdd || uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ImagePlus className="h-4 w-4 mr-2" />}
          Ajouter
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={(event) => handleFiles(event.target.files)}
        />
      </div>

      {currentPhoto ? (
        <div className="space-y-3">
          <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
            <img src={currentPhoto.url} alt="Photo du bovin" className="h-full w-full object-cover" />
            {photos.length > 1 && (
              <>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute left-2 top-1/2 h-8 w-8 -translate-y-1/2"
                  disabled={currentIndex === 0}
                  onClick={showPrevious}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2"
                  disabled={currentIndex === photos.length - 1}
                  onClick={showNext}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant={currentPhoto.isPrimary ? 'default' : 'outline'} size="sm" onClick={setPrimary} disabled={disabled}>
              <Star className="h-4 w-4 mr-2" />
              Principale
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => moveCurrent(-1)} disabled={disabled || currentIndex === 0}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button type="button" variant="outline" size="icon" onClick={() => moveCurrent(1)} disabled={disabled || currentIndex === photos.length - 1}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button type="button" variant="destructive" size="sm" onClick={removeCurrent} disabled={disabled}>
              <Trash2 className="h-4 w-4 mr-2" />
              Supprimer
            </Button>
          </div>

          <div className="grid grid-cols-5 gap-2">
            {photos.map((photo, index) => (
              <button
                type="button"
                key={`${photo.url}-${index}`}
                className={`relative aspect-square overflow-hidden rounded border ${index === currentIndex ? 'ring-2 ring-primary' : ''}`}
                onClick={() => setCurrentIndex(index)}
              >
                <img src={photo.url} alt={`Photo ${index + 1}`} className="h-full w-full object-cover" />
                {photo.isPrimary && <Star className="absolute right-1 top-1 h-3.5 w-3.5 fill-primary text-primary" />}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center rounded-md border border-dashed bg-muted/30 text-sm text-muted-foreground">
          Aucune photo ajoutée
        </div>
      )}
    </div>
  );
}
