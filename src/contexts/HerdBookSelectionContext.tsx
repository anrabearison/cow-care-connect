import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { HerdBook } from '@/types/herdbook';
import { useHerdBooks } from '@/features/herdbook/hooks';
import { useAuth } from '@/features/auth/AuthContext';

interface HerdBookSelectionContextType {
    selectedHerdBookId: string | null;
    selectedHerdBook: HerdBook | null;
    availableHerdBooks: HerdBook[];
    setSelectedHerdBookId: (id: string) => void;
    isLoading: boolean;
    error: string | null;
}

const HerdBookSelectionContext = createContext<HerdBookSelectionContextType | undefined>(undefined);

export const HerdBookSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user } = useAuth();
    const [selectedHerdBookId, setSelectedHerdBookIdState] = useState<string | null>(null);

    // Déterminer l'owner_id à utiliser - basé sur l'utilisateur connecté
    const effectiveOwnerId = user?.ownerId || user?.owner?.id;

    // Charger les HerdBooks pour le propriétaire - SEULEMENT si l'utilisateur est connecté
    const { data: herdBooksData, isLoading, error } = useHerdBooks(effectiveOwnerId || undefined);
    const availableHerdBooks = useMemo(() => herdBooksData?.data || [], [herdBooksData?.data]);

    // Sélectionner automatiquement le HerdBook le plus récent
    useEffect(() => {
        if (availableHerdBooks.length > 0 && !selectedHerdBookId) {
            // Trier par année DESC et prendre le premier
            const sortedByYear = [...availableHerdBooks].sort((a, b) => b.year - a.year);
            const mostRecent = sortedByYear[0];

            // Vérifier si un HerdBook est sauvegardé dans localStorage
            const storageKey = `selectedHerdBook_${effectiveOwnerId}`;
            const savedId = localStorage.getItem(storageKey);

            // Vérifier que le HerdBook sauvegardé existe toujours
            const savedExists = availableHerdBooks.find(hb => hb.id === savedId);

            // Utiliser le sauvegardé s'il existe, sinon le plus récent
            setSelectedHerdBookIdState(savedExists ? savedId : mostRecent.id);
        }
    }, [availableHerdBooks, selectedHerdBookId, effectiveOwnerId]);

    // Réinitialiser la sélection quand l'owner change
    useEffect(() => {
        setSelectedHerdBookIdState(null);
    }, [effectiveOwnerId]);

    // Fonction pour changer le HerdBook sélectionné
    const setSelectedHerdBookId = (id: string) => {
        setSelectedHerdBookIdState(id);

        // Sauvegarder dans localStorage
        if (effectiveOwnerId) {
            const storageKey = `selectedHerdBook_${effectiveOwnerId}`;
            localStorage.setItem(storageKey, id);
        }
    };

    // Trouver le HerdBook sélectionné
    const selectedHerdBook = availableHerdBooks.find(hb => hb.id === selectedHerdBookId) || null;

    const value: HerdBookSelectionContextType = {
        selectedHerdBookId,
        selectedHerdBook,
        availableHerdBooks,
        setSelectedHerdBookId,
        isLoading,
        error: error ? String(error) : null,
    };

    return (
        <HerdBookSelectionContext.Provider value={value}>
            {children}
        </HerdBookSelectionContext.Provider>
    );
};

/**
 * Hook pour utiliser le contexte HerdBookSelection
 * @throws Error si utilisé en dehors du Provider
 */
export const useHerdBookSelection = () => {
    const context = useContext(HerdBookSelectionContext);
    if (!context) {
        throw new Error('useHerdBookSelection must be used within HerdBookSelectionProvider');
    }
    return context;
};
