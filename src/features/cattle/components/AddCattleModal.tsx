import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cattle } from '@/features/cattle/types';
import { useCharacters } from '@/features/common/hooks/useReferences';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';

const cattleFormSchema = z.object({
    name: z.string().min(1, "Le nom est obligatoire"),
    nickname: z.string().optional(),
    gender: z.string().min(1, "Le sexe est obligatoire"),
    birthDate: z.string().min(1, "La date de naissance est obligatoire"),
    character: z.string().optional(),
    brand: z.string().optional(),
    distinctiveSign: z.string().optional(),
    nCarnet: z.string().optional(),
    sourceType: z.enum(['ACHETE', 'NE_DANS_TROUPEAU']),
    motherId: z.string().optional(),
    fatherId: z.string().optional(),
    purchaseSupplier: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.string().optional(),
    purchaseWeight: z.string().optional(),
    purchaseHealthStatus: z.string().optional(),
    purchaseNotes: z.string().optional(),
});

type CattleFormValues = z.infer<typeof cattleFormSchema>;

const defaultValues: CattleFormValues = {
    name: '',
    nickname: '',
    gender: '',
    birthDate: '',
    character: '',
    brand: '',
    distinctiveSign: '',
    nCarnet: '',
    sourceType: 'ACHETE',
    motherId: '',
    fatherId: '',
    purchaseSupplier: '',
    purchaseDate: '',
    purchasePrice: '',
    purchaseWeight: '',
    purchaseHealthStatus: '',
    purchaseNotes: '',
};

interface AddCattleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>, nCarnet?: string) => void;
}

export const AddCattleModal: React.FC<AddCattleModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { selectedHerdBook } = useHerdBookSelection();
    const { data: charactersData } = useCharacters();
    const characters = Array.isArray(charactersData?.data) ? charactersData.data : [];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<CattleFormValues>({
        resolver: zodResolver(cattleFormSchema),
        defaultValues,
    });

    const gender = watch('gender');
    const character = watch('character');
    const sourceType = watch('sourceType');

    // Default the character field to the first available one, once the
    // (cached, shared) reference data has loaded and none has been chosen yet.
    useEffect(() => {
        if (characters.length > 0 && !character) {
            setValue('character', characters[0].id.toString());
        }
    }, [characters, character, setValue]);

    const onSubmit = (data: CattleFormValues) => {
        const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
            name: data.name,
            nickname: data.nickname || undefined,
            gender: data.gender as 'M' | 'F',
            birthDate: data.birthDate,
            character: {
                id: data.character || '',
                name: characters.find(c => c.id.toString() === data.character)?.name || 'Docile'
            },
            brand: data.brand || undefined,
            distinctiveSign: data.distinctiveSign || undefined,
            photo: undefined,
            // status removed as not supported by backend on create
            motherId: data.sourceType === 'NE_DANS_TROUPEAU' && data.motherId ? data.motherId : undefined,
            fatherId: data.sourceType === 'NE_DANS_TROUPEAU' && data.fatherId ? data.fatherId : undefined,
            source: {
                type: data.sourceType,
                supplier: data.sourceType === 'ACHETE' ? data.purchaseSupplier : undefined,
                purchaseDate: data.sourceType === 'ACHETE' && data.purchaseDate ? data.purchaseDate : undefined,
                purchasePrice: data.sourceType === 'ACHETE' && data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
                purchaseWeight: data.sourceType === 'ACHETE' && data.purchaseWeight ? parseFloat(data.purchaseWeight) : undefined,
                purchaseHealthStatus: data.sourceType === 'ACHETE' ? data.purchaseHealthStatus : undefined,
                purchaseNotes: data.sourceType === 'ACHETE' ? data.purchaseNotes : undefined,
            }
        };

        onAdd(cattleData, data.nCarnet || undefined);
        reset(defaultValues);
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset(defaultValues);
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel animal</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous pour ajouter un nouvel animal au troupeau.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6 py-4">
                        {/* Informations Générales */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations Générales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input
                                        id="name"
                                        {...register('name')}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nickname">Surnom</Label>
                                    <Input
                                        id="nickname"
                                        {...register('nickname')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Sexe *</Label>
                                    <Select
                                        value={gender}
                                        onValueChange={(value) => setValue('gender', value, { shouldValidate: true })}
                                    >
                                        <SelectTrigger id="gender" className={errors.gender ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Mâle</SelectItem>
                                            <SelectItem value="F">Femelle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.gender && <p className="text-sm text-red-500">{errors.gender.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birthDate">Date de naissance *</Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        {...register('birthDate')}
                                        className={errors.birthDate ? 'border-red-500' : ''}
                                    />
                                    {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="character">Caractère</Label>
                                    <Select
                                        value={character}
                                        onValueChange={(value) => setValue('character', value)}
                                    >
                                        <SelectTrigger id="character">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {characters.map((char) => (
                                                <SelectItem key={char.id} value={char.id.toString()}>
                                                    {char.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand">Marque</Label>
                                    <Input
                                        id="brand"
                                        {...register('brand')}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nCarnet">N° Carnet</Label>
                                    <Input
                                        id="nCarnet"
                                        {...register('nCarnet')}
                                        placeholder="Numéro de carnet pour le livre de troupeau"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Origine */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Origine</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="sourceType">Type d'origine</Label>
                                    <Select
                                        value={sourceType}
                                        onValueChange={(value) => setValue('sourceType', value as 'ACHETE' | 'NE_DANS_TROUPEAU')}
                                    >
                                        <SelectTrigger id="sourceType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ACHETE">Acheté</SelectItem>
                                            <SelectItem value="NE_DANS_TROUPEAU">Né dans le troupeau</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {sourceType === 'ACHETE' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseSupplier">Fournisseur</Label>
                                            <Input
                                                id="purchaseSupplier"
                                                {...register('purchaseSupplier')}
                                                placeholder="Nom du fournisseur"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseDate">Date d'achat</Label>
                                            <Input
                                                id="purchaseDate"
                                                type="date"
                                                {...register('purchaseDate')}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchasePrice">Prix d'achat (MGA)</Label>
                                            <Input
                                                id="purchasePrice"
                                                type="number"
                                                {...register('purchasePrice')}
                                                placeholder="Ex: 500000"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseWeight">Poids à l'achat (kg)</Label>
                                            <Input
                                                id="purchaseWeight"
                                                type="number"
                                                {...register('purchaseWeight')}
                                                placeholder="Ex: 250"
                                            />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="purchaseHealthStatus">État de santé à l'achat</Label>
                                            <Input
                                                id="purchaseHealthStatus"
                                                {...register('purchaseHealthStatus')}
                                                placeholder="Ex: En bonne santé"
                                            />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="purchaseNotes">Notes d'achat</Label>
                                            <Textarea
                                                id="purchaseNotes"
                                                {...register('purchaseNotes')}
                                                placeholder="Notes supplémentaires sur l'achat"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {sourceType === 'NE_DANS_TROUPEAU' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="grid gap-2">
                                            <Label htmlFor="motherId">ID de la mère</Label>
                                            <Input
                                                id="motherId"
                                                {...register('motherId')}
                                                placeholder="UUID du bovin mère"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="fatherId">ID du père</Label>
                                            <Input
                                                id="fatherId"
                                                {...register('fatherId')}
                                                placeholder="UUID du bovin père (Optionnel)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
