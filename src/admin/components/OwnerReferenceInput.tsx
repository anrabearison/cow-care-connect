import React from 'react';
import { ReferenceInput, SelectInput, useGetIdentity, usePermissions, required } from 'react-admin';
import { isSuperAdmin } from '@/constants/roles';

interface OwnerReferenceInputProps {
    source?: string;
    label?: string;
    isRequired?: boolean;
}

export const OwnerReferenceInput: React.FC<OwnerReferenceInputProps> = ({
    source = "owner_id",
    label = "Propriétaire",
    isRequired = true
}) => {
    const { permissions } = usePermissions();
    const { data: identity, isLoading } = useGetIdentity();

    if (isLoading) return null;

    // Si Super Admin, on affiche le sélecteur de propriétaire
    if (isSuperAdmin(permissions)) {
        return (
            <ReferenceInput source={source} reference="owners" label={label}>
                <SelectInput
                    optionText="name"
                    validate={isRequired ? required() : undefined}
                    fullWidth
                />
            </ReferenceInput>
        );
    }

    // Si Owner Admin ou User, on assigne automatiquement le propriétaire de l'utilisateur
    // On n'affiche rien (champ caché) ou un champ désactivé si on veut montrer l'info
    // Ici on choisit de ne rien afficher pour simplifier le formulaire, 
    // mais on s'assure que la valeur est bien passée (via defaultValue dans le Create/Edit parent ou via transform)
    // NOTE: React Admin gère mal les champs cachés sans input. 
    // On va utiliser un input caché avec une valeur par défaut.

    // @ts-ignore - identity.owner_id est ajouté dans authProvider
    const ownerId = identity?.owner_id;

    if (!ownerId) return null;

    return (
        <div style={{ display: 'none' }}>
            <ReferenceInput source={source} reference="owners">
                <SelectInput
                    optionText="name"
                    defaultValue={ownerId}
                    disabled
                />
            </ReferenceInput>
        </div>
    );
};
