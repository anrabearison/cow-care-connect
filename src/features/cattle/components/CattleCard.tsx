import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Cattle } from '@/features/cattle/types';
import { CattlePhotoCarousel } from './CattlePhotoCarousel';
import {
  calculateAge,
  getCharacterColor,
  getGenderIcon,
  getStatusColor
} from '../utils/helpers';

interface CattleCardProps {
  cattle: Cattle;
}

export const CattleCard = React.memo(({ cattle }: CattleCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-farm transition-all duration-300 group">
      <Link to={`/cattle/${cattle.id}`} className="block relative h-48 overflow-hidden">
        <CattlePhotoCarousel
          cattle={cattle}
          className="h-full w-full"
          imageClassName="group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <Badge className="bg-white/90 rounded-full w-8 h-8 flex items-center justify-center p-0 text-2xl">
            {getGenderIcon(cattle.gender)}
          </Badge>
        </div>
      </Link>

      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-foreground">
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

          {cattle.nCarnet && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">N° Carnet</span>
              <span className="text-sm font-medium text-foreground">{cattle.nCarnet}</span>
            </div>
          )}

          {cattle.status && (
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Statut</span>
              <Badge className={`text-xs ${getStatusColor(cattle.status.id)}`}>
                {cattle.status.name}
              </Badge>
            </div>
          )}

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Source</span>
              <div className="flex items-center space-x-1 text-sm">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="text-foreground">
                  {cattle.source.type === 'ACHETE' ? 'Acheté' :
                    cattle.source.type === 'NE_DANS_TROUPEAU' ? 'Né dans le troupeau' :
                      cattle.source.type}
                </span>
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
