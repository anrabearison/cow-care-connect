import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Users } from 'lucide-react';
import { CattleCard } from '@/components/CattleCard';
import { mockCattleData } from '@/data/mockData';
import { Cattle } from '@/types/cattle';

export default function CattlePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [characterFilter, setCharacterFilter] = useState<string>('all');
  const [filteredCattle, setFilteredCattle] = useState<Cattle[]>(mockCattleData);

  // Apply filters
  const applyFilters = () => {
    let filtered = mockCattleData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(cattle =>
        cattle.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cattle.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Gender filter
    if (genderFilter !== 'all') {
      filtered = filtered.filter(cattle => cattle.genre === genderFilter);
    }

    // Character filter
    if (characterFilter !== 'all') {
      filtered = filtered.filter(cattle => cattle.caractere === characterFilter);
    }

    setFilteredCattle(filtered);
  };

  // Apply filters when dependencies change
  useEffect(() => {
    applyFilters();
  }, [searchTerm, genderFilter, characterFilter]);

  const resetFilters = () => {
    setSearchTerm('');
    setGenderFilter('all');
    setCharacterFilter('all');
  };

  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Gestion du Troupeau</h1>
          </div>
          <p className="text-lg text-muted-foreground">
            Gérez et surveillez vos {mockCattleData.length} animaux
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card-soft">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtres et recherche</span>
            </CardTitle>
            <CardDescription>
              Recherchez et filtrez vos animaux selon vos critères
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Gender Filter */}
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les genres</SelectItem>
                  <SelectItem value="M">Mâle</SelectItem>
                  <SelectItem value="F">Femelle</SelectItem>
                </SelectContent>
              </Select>

              {/* Character Filter */}
              <Select value={characterFilter} onValueChange={setCharacterFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Caractère" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les caractères</SelectItem>
                  <SelectItem value="Docile">Docile</SelectItem>
                  <SelectItem value="Agressif">Agressif</SelectItem>
                  <SelectItem value="Timide">Timide</SelectItem>
                  <SelectItem value="Energique">Energique</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              <Button 
                variant="outline" 
                onClick={resetFilters}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {filteredCattle.length} animal{filteredCattle.length > 1 ? 'aux' : ''} trouvé{filteredCattle.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Cattle Grid */}
        {filteredCattle.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCattle.map((cattle) => (
              <CattleCard key={cattle.id} cattle={cattle} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">🐄</div>
              <h3 className="text-xl font-semibold mb-2">Aucun animal trouvé</h3>
              <p className="text-muted-foreground mb-4">
                Aucun animal ne correspond à vos critères de recherche
              </p>
              <Button variant="outline" onClick={resetFilters}>
                Réinitialiser les filtres
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}