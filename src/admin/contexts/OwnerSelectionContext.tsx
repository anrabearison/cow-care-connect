import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface OwnerSelectionContextType {
    selectedOwnerId: string | null;
    setSelectedOwnerId: (ownerId: string | null) => void;
}

const OwnerSelectionContext = createContext<OwnerSelectionContextType | undefined>(undefined);

export const OwnerSelectionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Load from localStorage on mount
    const [selectedOwnerId, setSelectedOwnerIdState] = useState<string | null>(() => {
        const stored = localStorage.getItem('admin_selected_owner_id');
        return stored || null;
    });

    // Persist to localStorage when changed
    const setSelectedOwnerId = (ownerId: string | null) => {
        setSelectedOwnerIdState(ownerId);
        if (ownerId) {
            localStorage.setItem('admin_selected_owner_id', ownerId);
        } else {
            localStorage.removeItem('admin_selected_owner_id');
        }
    };

    // Clear on unmount (logout)
    useEffect(() => {
        return () => {
            localStorage.removeItem('admin_selected_owner_id');
        };
    }, []);

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
