import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Cattle } from '@/features/cattle/types';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';
import {
  calculateAge,
  getCharacterColor,
  getCategoryColor,
  getGenderIcon,
  getStatusColor
} from '../utils/helpers';

const cattleImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

interface CattleCardProps {
  cattle: Cattle;
}

export const CattleCard = React.memo(({ cattle }: CattleCardProps) => {

  // Use a consistent image based on the cattle ID if photo exists
  const imageIndex = cattle.id % cattleImages.length;
  const cattleImage = cattle.photo || cattleImages[imageIndex];

  return (
    <Card className="overflow-hidden hover:shadow-farm transition-all duration-300 group">
      <Link to={`/cattle/${cattle.id}`} className="block relative h-48 overflow-hidden">
        {cattle.photo || imageIndex < 3 ? (
          <img
            src={cattleImage}
            alt={`Photo de ${cattle.name}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/20">
            <div className="text-6xl">🐄</div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge className="bg-white/90 text-primary border-0 shadow-sm">
            {cattle.id}
          </Badge>
        </div>
        <div className="absolute top-3 left-3">
          <div className="text-2xl bg-white/90 rounded-full w-8 h-8 flex items-center justify-center">
            {getGenderIcon(cattle.gender)}
          </div>
        </div>
      </Link>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {cattle.name}{cattle.nickname && ` (${cattle.nickname})`}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>{calculateAge(cattle.birthDate)}</span>
            </div>
          </div>
          <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 cursor-pointer transition-colors" />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Catégorie</span>
            <Badge className={getCategoryColor(cattle.category.name)}>
              {cattle.category.name}
            </Badge>
          </div>
          {cattle.character && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Caractère</span>
              <Badge className={`text-xs ${getCharacterColor(cattle.character.name)}`}>
                {cattle.character.name}
              </Badge>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Sexe</span>
            <span className="text-sm font-medium text-foreground">{cattle.gender === 'M' ? 'Mâle' : 'Femelle'}</span>
          </div>

          {cattle.herdBookNumber && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">N° Carnet</span>
              <span className="text-sm font-medium text-foreground">{cattle.herdBookNumber}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Statut</span>
            <Badge className={`text-xs ${getStatusColor(cattle.status.name)}`}>
              {cattle.status.name}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Source</span>
            <div className="flex items-center space-x-1 text-sm">
              <MapPin className="h-3 w-3 text-primary" />
              <span className="text-foreground">{cattle.source.type}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Événements</span>
            <span className="text-sm font-medium text-primary">
              {cattle.events.length}
            </span>
          </div>
        </div>

        <Link to={`/cattle/${cattle.id}`}>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300">
            Voir détails
          </Button>
        </Link>
      </CardContent>
    </Card >
  );
});

CattleCard.displayName = 'CattleCard';