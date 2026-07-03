import React, { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface OwnerSelectionContextType {
    selectedOwnerId: string | null;
    setSelectedOwnerId: (ownerId: string | null) => void;
    selectedOwnerName: string | null;
    setSelectedOwnerName: (name: string | null) => void;
}

const OwnerSelectionContext = createContext<OwnerSelectionContextType | undefined>(undefined);

const STORAGE_KEY = 'frontoffice_selected_owner_id';
const STORAGE_NAME_KEY = 'frontoffice_selected_owner_name';

export const OwnerSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load from localStorage on mount
    const [selectedOwnerId, setSelectedOwnerIdState] = useState<string | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored || null;
    });

    const [selectedOwnerName, setSelectedOwnerNameState] = useState<string | null>(() => {
        const stored = localStorage.getItem(STORAGE_NAME_KEY);
        return stored || null;
    });

    // Persist to localStorage when changed.
    // NOTE: do NOT clear on unmount — window.location.reload() unmounts React
    // before the new value can be read on the next load, wiping the selection.
    const setSelectedOwnerId = useCallback((ownerId: string | null) => {
        setSelectedOwnerIdState(ownerId);
        if (ownerId) {
            localStorage.setItem(STORAGE_KEY, ownerId);
        } else {
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(STORAGE_NAME_KEY);
            setSelectedOwnerNameState(null);
        }
    }, []);

    const setSelectedOwnerName = useCallback((name: string | null) => {
        setSelectedOwnerNameState(name);
        if (name) {
            localStorage.setItem(STORAGE_NAME_KEY, name);
        }
    }, []);

    return (
        <OwnerSelectionContext.Provider value={{
            selectedOwnerId,
            setSelectedOwnerId,
            selectedOwnerName,
            setSelectedOwnerName
        }}>
            {children}
        </OwnerSelectionContext.Provider>
    );
};

export const useOwnerSelection = () => {
    const context = useContext(OwnerSelectionContext);
    if (!context) {
        throw new Error('useOwnerSelection must be used within OwnerSelectionProvider');
    }
    return context;
};

/** Call this on explicit logout to clear the persisted owner selection. */
export const clearOwnerSelection = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_NAME_KEY);
};
