import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Heart } from 'lucide-react';
import { Cattle } from '@/types/cattle';
import cattlePortrait1 from '@/assets/cattle-portrait-1.jpg';
import cattlePortrait2 from '@/assets/cattle-portrait-2.jpg';
import cattlePortrait3 from '@/assets/cattle-portrait-3.jpg';

const cattleImages = [cattlePortrait1, cattlePortrait2, cattlePortrait3];

interface CattleCardProps {
  cattle: Cattle;
}

const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const today = new Date();
  const ageInMonths = (today.getFullYear() - birth.getFullYear()) * 12 + 
                     (today.getMonth() - birth.getMonth());
  
  if (ageInMonths < 12) {
    return `${ageInMonths} mois`;
  } else {
    const years = Math.floor(ageInMonths / 12);
    return `${years} an${years > 1 ? 's' : ''}`;
  }
};

const getCharacterColor = (character: string) => {
  switch (character) {
    case 'Docile':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Agressif':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Timide':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Energique':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getGenderIcon = (gender: string) => {
  return gender === 'M' ? '♂️' : '♀️';
};

export function CattleCard({ cattle }: CattleCardProps) {
  // Use a consistent image based on the cattle ID if photo exists
  const imageIndex = parseInt(cattle.id.slice(1)) % cattleImages.length;
  const cattleImage = cattle.photo || cattleImages[imageIndex];

  return (
    <Card className="overflow-hidden hover:shadow-farm transition-all duration-300 group">
      <div className="relative h-48 overflow-hidden">
        {cattle.photo || imageIndex < 3 ? (
          <img 
            src={cattleImage}
            alt={`Photo de ${cattle.nom}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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
            {getGenderIcon(cattle.genre)}
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-foreground">{cattle.nom}</h3>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
              <Calendar className="h-4 w-4" />
              <span>{calculateAge(cattle.dateNaissance)}</span>
            </div>
          </div>
          <Heart className="h-5 w-5 text-muted-foreground hover:text-red-500 cursor-pointer transition-colors" />
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Caractère</span>
            <Badge className={`text-xs ${getCharacterColor(cattle.caractere)}`}>
              {cattle.caractere}
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
              {cattle.evenements.length}
            </span>
          </div>
        </div>

        <Link to={`/cattle/${cattle.id}`}>
          <Button className="w-full bg-gradient-primary hover:opacity-90 transition-all duration-300">
            Voir détails
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}