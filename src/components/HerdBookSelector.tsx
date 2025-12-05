import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { BookOpen, Calendar, AlertCircle } from 'lucide-react';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';

export const HerdBookSelector = () => {
    const {
        selectedHerdBookId,
        selectedHerdBook,
        availableHerdBooks,
        setSelectedHerdBookId,
        isLoading,
        error,
    } = useHerdBookSelection();

    if (isLoading) {
        return (
            <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-12 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Erreur lors du chargement des livres de troupeau: {error}
                </AlertDescription>
            </Alert>
        );
    }

    if (availableHerdBooks.length === 0) {
        return (
            <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-amber-800">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-sm font-medium">
                            Aucun livre de troupeau disponible
                        </p>
                    </div>
                    <p className="text-xs text-amber-700 mt-1">
                        Veuillez créer un livre de troupeau pour commencer
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Livre de troupeau
            </label>

            <Select value={selectedHerdBookId || undefined} onValueChange={setSelectedHerdBookId}>
                <SelectTrigger className="w-full bg-white/80 border-primary/10">
                    <SelectValue placeholder="Sélectionner un livre de troupeau">
                        {selectedHerdBook && (
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span className="font-medium">{selectedHerdBook.year}</span>
                                <span className="text-muted-foreground">-</span>
                                <span>{selectedHerdBook.reference}</span>
                                {selectedHerdBook.cattle_count !== undefined && (
                                    <Badge variant="secondary" className="ml-auto">
                                        {selectedHerdBook.cattle_count} {selectedHerdBook.cattle_count > 1 ? 'bœufs' : 'bœuf'}
                                    </Badge>
                                )}
                            </div>
                        )}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    {availableHerdBooks
                        .sort((a, b) => b.year - a.year) // Plus récent en premier
                        .map((herdBook) => (
                            <SelectItem key={herdBook.id} value={herdBook.id}>
                                <div className="flex items-center gap-3 w-full">
                                    <Calendar className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                    <div className="flex-1">
                                        <span className="font-medium">{herdBook.year}</span>
                                        <span className="text-muted-foreground mx-2">-</span>
                                        <span>{herdBook.reference}</span>
                                    </div>
                                    {herdBook.cattle_count !== undefined && (
                                        <Badge variant="outline" className="ml-2 flex-shrink-0">
                                            {herdBook.cattle_count}
                                        </Badge>
                                    )}
                                </div>
                            </SelectItem>
                        ))}
                </SelectContent>
            </Select>

            {selectedHerdBook?.description && (
                <p className="text-xs text-muted-foreground italic">
                    {selectedHerdBook.description}
                </p>
            )}

            {selectedHerdBook && (
                <p className="text-xs text-muted-foreground">
                    Année sélectionnée: <span className="font-medium">{selectedHerdBook.year}</span>
                </p>
            )}
        </div>
    );
};
