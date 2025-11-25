import React, { useState } from 'react';
import {
    Toolbar,
    SaveButton,
    DeleteButton,
    ToolbarProps,
    useRecordContext,
    useNotify,
    useRedirect,
    useDelete,
    useUpdate,
    useCreate,
    useResourceContext,
} from 'react-admin';
import { useFormContext } from 'react-hook-form';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Save, Trash2, Plus, AlertTriangle, X } from 'lucide-react';

/**
 * Toolbar personnalisée pour les formulaires d'édition
 * Ajoute une confirmation moderne avant la sauvegarde et la suppression
 */
export const EditToolbar = (props: ToolbarProps) => {
    const record = useRecordContext();
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const { getValues, formState } = useFormContext();
    const [update, { isLoading: isUpdating }] = useUpdate();
    const [deleteOne, { isLoading: isDeleting }] = useDelete();

    const [showSaveDialog, setShowSaveDialog] = useState(false);

    const handleSaveConfirm = () => {
        if (!record || !resource) return;

        const data = getValues();
        update(
            resource,
            { id: record.id, data },
            {
                onSuccess: () => {
                    notify('Modifications enregistrées avec succès', { type: 'success' });
                    redirect('list', resource);
                },
                onError: (error: any) => {
                    notify(error?.message || 'Erreur lors de l\'enregistrement', { type: 'error' });
                },
            }
        );
        setShowSaveDialog(false);
    };

    const handleCancel = () => {
        if (!resource) return;
        redirect('list', resource);
    };

    return (
        <>
            <Toolbar {...props} className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2"
                >
                    <X className="h-4 w-4" />
                    Annuler
                </Button>

                <Button
                    type="button"
                    onClick={() => setShowSaveDialog(true)}
                    disabled={isUpdating || !formState.isDirty}
                    className="gap-2"
                >
                    <Save className="h-4 w-4" />
                    Enregistrer
                </Button>
            </Toolbar>

            {/* Dialogue de confirmation pour la sauvegarde */}
            <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Save className="h-5 w-5 text-primary" />
                            Confirmer l'enregistrement
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir enregistrer ces modifications ?
                            Cette action mettra à jour les données de manière permanente.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleSaveConfirm}>
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

/**
 * Toolbar personnalisée pour les formulaires de création
 * Ajoute une confirmation moderne avant la création
 */
export const CreateToolbar = (props: ToolbarProps) => {
    const resource = useResourceContext();
    const notify = useNotify();
    const redirect = useRedirect();
    const { getValues, formState } = useFormContext();
    const [create, { isLoading }] = useCreate();

    const [showDialog, setShowDialog] = useState(false);

    const handleConfirm = () => {
        if (!resource) return;

        const data = getValues();
        create(
            resource,
            { data },
            {
                onSuccess: () => {
                    notify('Élément créé avec succès', { type: 'success' });
                    redirect('list', resource);
                },
                onError: (error: any) => {
                    notify(error?.message || 'Erreur lors de la création', { type: 'error' });
                },
            }
        );
        setShowDialog(false);
    };

    const handleCancel = () => {
        if (!resource) return;
        redirect('list', resource);
    };

    return (
        <>
            <Toolbar {...props} className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2"
                >
                    <X className="h-4 w-4" />
                    Annuler
                </Button>

                <Button
                    type="button"
                    onClick={() => setShowDialog(true)}
                    disabled={isLoading || !formState.isValid}
                    className="gap-2"
                >
                    <Plus className="h-4 w-4" />
                    Créer
                </Button>
            </Toolbar>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <Plus className="h-5 w-5 text-primary" />
                            Confirmer la création
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir créer cet élément ?
                            Les données seront enregistrées dans la base de données.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirm}>
                            Confirmer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

/**
 * Bouton de suppression avec confirmation pour les listes
 */
export const ConfirmDeleteButton = ({
    record,
    resource,
    title = "Confirmer la suppression",
    message = "Êtes-vous sûr de vouloir supprimer cet élément ?"
}: {
    record?: any;
    resource?: string;
    title?: string;
    message?: string;
}) => {
    const notify = useNotify();
    const [deleteOne, { isLoading }] = useDelete();
    const [showDialog, setShowDialog] = useState(false);

    const handleConfirm = () => {
        if (!record || !resource) return;

        deleteOne(
            resource,
            { id: record.id, previousData: record },
            {
                onSuccess: () => {
                    notify('Élément supprimé avec succès', { type: 'success' });
                },
                onError: (error: any) => {
                    notify(error?.message || 'Erreur lors de la suppression', { type: 'error' });
                },
            }
        );
        setShowDialog(false);
    };

    return (
        <>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={(e) => {
                    e.stopPropagation();
                    setShowDialog(true);
                }}
                disabled={isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="h-4 w-4" />
            </Button>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                            <AlertTriangle className="h-5 w-5" />
                            {title}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {message}
                            <span className="block mt-2 font-semibold text-destructive">
                                Cette action est irréversible.
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                            Annuler
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.stopPropagation();
                                handleConfirm();
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                        >
                            Supprimer définitivement
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
