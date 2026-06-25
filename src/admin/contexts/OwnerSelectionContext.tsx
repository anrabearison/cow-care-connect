import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OwnerSelectionContextType {
    selectedOwnerId: string | null;
    setSelectedOwnerId: (ownerId: string | null) => void;
}

const OwnerSelectionContext = createContext<OwnerSelectionContextType | undefined>(undefined);

const STORAGE_KEY = 'admin_selected_owner_id';

export const OwnerSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load from localStorage on mount
    const [selectedOwnerId, setSelectedOwnerIdState] = useState<string | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored || null;
    });

    // Persist to localStorage when changed
    // NOTE: do NOT clear on unmount — the page reload triggered by the selector
    // would fire the cleanup before the new value is read on the next load.
    const setSelectedOwnerId = (ownerId: string | null) => {
        setSelectedOwnerIdState(ownerId);
        if (ownerId) {
            localStorage.setItem(STORAGE_KEY, ownerId);
        } else {
            localStorage.removeItem(STORAGE_KEY);
        }
    };

    return (
        <OwnerSelectionContext.Provider value={{ selectedOwnerId, setSelectedOwnerId }}>
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

/** Call this on explicit logout to clear the persisted selection. */
export const clearOwnerSelection = () => {
    localStorage.removeItem(STORAGE_KEY);
};
