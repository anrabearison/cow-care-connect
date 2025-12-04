import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Search, Filter, Users, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { CattleCard } from '@/features/cattle/components/CattleCard';
import { Cattle } from '@/features/cattle/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useCattle, useCreateCattle } from '@/features/cattle/hooks';
import { AddPurchaseModal } from '@/features/cattle/components/AddPurchaseModal';
import { useCategories } from '@/features/common/hooks/useReferences';
import { useAuth } from '@/features/auth/AuthContext';
import { useOwnerSelection } from '@/contexts/OwnerSelectionContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function CattlePage() {
  const { user } = useAuth();
  const { selectedOwnerId } = useOwnerSelection();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Check if Super Admin has selected an owner
  const isSuperAdmin = user?.role === 'super_admin';
  const canAddCattle = !isSuperAdmin || selectedOwnerId !== null;

  // Load categories with React Query
  const { data: categoriesData } = useCategories();
  const categories = categoriesData?.data || [];

  // Memoize filters object to prevent unnecessary re-renders
  const filters = useMemo(() => ({
    q: searchTerm || undefined,
    gender: genderFilter !== 'all' ? (genderFilter as 'M' | 'F') : undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    source_type: sourceFilter !== 'all' ? sourceFilter : undefined,
    page: currentPage,
    per_page: itemsPerPage,
  }), [searchTerm, genderFilter, categoryFilter, sourceFilter, currentPage]);

  const { cattle, loading: isLoading, total } = useCattle(filters);
  const createCattleMutation = useCreateCattle();

  // Memoize reset filters function
  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setGenderFilter('all');
    setSourceFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  }, []);

  // Memoize total pages calculation
  const totalPages = useMemo(() => Math.ceil(total / itemsPerPage), [total, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, genderFilter, sourceFilter, categoryFilter]);

  // Memoize add cattle handler
  const handleAddCattle = useCallback(async (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>) => {
    const fullCattleData: Omit<Cattle, 'id'> = {
      ...cattleData,
      events: [],
      treatments: []
    };
    createCattleMutation.mutate(fullCattleData);
  }, [createCattleMutation]);


  return (
    <div className="min-h-screen bg-gradient-earth">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              <h1 className="text-2xl sm:text-4xl font-bold text-foreground">Gestion du Troupeau</h1>
            </div>
            <p className="text-sm sm:text-lg text-muted-foreground">
              Gérez et surveillez vos {total} animaux
            </p>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    onClick={() => setIsAddModalOpen(true)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2"
                    disabled={!canAddCattle}
                  >
                    <Plus className="h-4 w-4" />
                    Nouvel achat
                  </Button>
                </div>
              </TooltipTrigger>
              {!canAddCattle && (
                <TooltipContent>
                  <p>Veuillez sélectionner un propriétaire pour ajouter un animal</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>

        {/* Filters */}
        <Card className="mb-8 shadow-card-soft border-none bg-white/50 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between cursor-pointer sm:cursor-default" onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
              <div className="space-y-1">
                <CardTitle className="flex items-center space-x-2 text-xl">
                  <Filter className="h-5 w-5 text-primary" />
                  <span>Filtres et recherche</span>
                </CardTitle>
                <CardDescription className="hidden sm:block">
                  Recherchez et filtrez vos animaux selon vos critères
                </CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="sm:hidden">
                {isFiltersOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent className={`${isFiltersOpen ? 'block' : 'hidden'} sm:block animate-in slide-in-from-top-2 duration-200`}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-primary/10 focus:border-primary/30 transition-all duration-300"
                />
              </div>

              {/* Gender Filter */}
              <Select value={genderFilter} onValueChange={setGenderFilter}>
                <SelectTrigger className="bg-white/80 border-primary/10">
                  <SelectValue placeholder="Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les genres</SelectItem>
                  <SelectItem value="M">Mâle</SelectItem>
                  <SelectItem value="F">Femelle</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="bg-white/80 border-primary/10">
                  <SelectValue placeholder="Catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Source Filter */}
              <Select value={sourceFilter} onValueChange={setSourceFilter}>
                <SelectTrigger className="bg-white/80 border-primary/10">
                  <SelectValue placeholder="Source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les sources</SelectItem>
                  <SelectItem value="Acheté">Acheté</SelectItem>
                  <SelectItem value="Né dans le troupeau">Né dans le troupeau</SelectItem>
                </SelectContent>
              </Select>

              {/* Reset Button */}
              <Button
                variant="outline"
                onClick={resetFilters}
                className="border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors"
              >
                Réinitialiser
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Info */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {total} animal{total > 1 ? 'aux' : ''} trouvé{total > 1 ? 's' : ''}
            {total > itemsPerPage && (
              <span className="ml-2">
                (Page {currentPage} sur {totalPages})
              </span>
            )}
          </p>
        </div>

        {/* Cattle Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: itemsPerPage }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-5 w-5" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-8" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : cattle.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {cattle.map((cattle) => (
                <CattleCard key={cattle.id} cattle={cattle} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(currentPage - 1);
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(pageNum);
                          }}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    ))}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
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

      <AddPurchaseModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAdd={handleAddCattle}
      />
    </div>
  );
}