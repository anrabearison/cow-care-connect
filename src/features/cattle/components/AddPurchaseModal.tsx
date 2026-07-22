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
import { Calendar } from 'lucide-react';

const purchaseFormSchema = z.object({
    herdBookId: z.string().min(1, "Le livre de troupeau est obligatoire"),
    name: z.string().min(1, "Le nom est obligatoire"),
    nickname: z.string().optional(),
    gender: z.string().min(1, "Le sexe est obligatoire"),
    birthDate: z.string().min(1, "La date de naissance est obligatoire"),
    character: z.string().optional(),
    brand: z.string().optional(),
    distinctiveSign: z.string().optional(),
    purchaseSupplier: z.string().optional(),
    purchaseDate: z.string().optional(),
    purchasePrice: z.string().optional(),
    purchaseWeight: z.string().optional(),
    purchaseHealthStatus: z.string().optional(),
    purchaseNotes: z.string().optional(),
});

type PurchaseFormValues = z.infer<typeof purchaseFormSchema>;

const defaultValues: PurchaseFormValues = {
    herdBookId: '',
    name: '',
    nickname: '',
    gender: '',
    birthDate: '',
    character: 'none',
    brand: '',
    distinctiveSign: '',
    purchaseSupplier: '',
    purchaseDate: '',
    purchasePrice: '',
    purchaseWeight: '',
    purchaseHealthStatus: '',
    purchaseNotes: '',
};

interface AddPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>, herdBookId?: string) => void;
}

export const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { data: charactersData } = useCharacters();
    const characters = Array.isArray(charactersData?.data) ? charactersData.data : [];

    // HerdBook selection
    const { availableHerdBooks, selectedHerdBookId: contextHerdBookId } = useHerdBookSelection();

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        reset,
        formState: { errors },
    } = useForm<PurchaseFormValues>({
        resolver: zodResolver(purchaseFormSchema),
        defaultValues,
    });

    const herdBookId = watch('herdBookId');
    const gender = watch('gender');
    const character = watch('character');

    useEffect(() => {
        if (open && !herdBookId) {
            if (contextHerdBookId) {
                setValue('herdBookId', contextHerdBookId);
            } else if (availableHerdBooks.length > 0) {
                // Default to most recent
                const sorted = [...availableHerdBooks].sort((a, b) => b.year - a.year);
                setValue('herdBookId', sorted[0].id);
            }
        }
    }, [open, contextHerdBookId, availableHerdBooks, herdBookId, setValue]);

    // Default the character field to the first available one, once the
    // (cached, shared) reference data has loaded and none has been chosen yet.
    // getValues() is a non-reactive read, so this effect only needs to depend
    // on `characters` — it won't refire (and override a manual selection)
    // just because the user picks a character.
    useEffect(() => {
        if (characters.length > 0 && getValues('character') === 'none') {
            setValue('character', characters[0].id);
        }
    }, [characters, getValues, setValue]);

    const onSubmit = (data: PurchaseFormValues) => {
        const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
            name: data.name,
            nickname: data.nickname || undefined,
            gender: data.gender as 'M' | 'F',
            birthDate: data.birthDate,
            character: data.character && data.character !== 'none' ? {
                id: data.character,
                name: characters.find(c => c.id === data.character)?.name || ''
            } : undefined,
            brand: data.brand || undefined,
            distinctiveSign: data.distinctiveSign || undefined,
            photo: undefined,
            // status removed as not supported by backend on create
            source: {
                type: 'ACHETE',
                supplier: data.purchaseSupplier || undefined,
                purchaseDate: data.purchaseDate || undefined,
                purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : undefined,
                purchaseWeight: data.purchaseWeight ? parseFloat(data.purchaseWeight) : undefined,
                purchaseHealthStatus: data.purchaseHealthStatus || undefined,
                purchaseNotes: data.purchaseNotes || undefined,
            }
        };

        onAdd(cattleData, data.herdBookId);
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
                    <DialogTitle>Nouvel achat</DialogTitle>
                    <DialogDescription>
                        Enregistrez l'achat d'un nouvel animal pour le troupeau.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-6 py-4">
                        {/* Informations Générales */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations Générales</h3>

                            {/* HerdBook Selection */}
                            <div className="mb-4">
                                <Label htmlFor="herdBook">Livre de troupeau *</Label>
                                <Select
                                    value={herdBookId}
                                    onValueChange={(value) => setValue('herdBookId', value, { shouldValidate: true })}
                                >
                                    <SelectTrigger id="herdBook" className={errors.herdBookId ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Sélectionner un livre de troupeau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableHerdBooks
                                            .sort((a, b) => b.year - a.year)
                                            .map((hb) => (
                                                <SelectItem key={hb.id} value={hb.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{hb.year} - {hb.reference}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.herdBookId && <p className="text-sm text-red-500">{errors.herdBookId.message}</p>}
                            </div>

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
                                            <SelectValue placeholder="Sélectionner (optionnel)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
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
                                    <Label htmlFor="distinctiveSign">Signe particulier</Label>
                                    <Input
                                        id="distinctiveSign"
                                        {...register('distinctiveSign')}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informations d'achat */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations d'achat</h3>
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
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Enregistrer l'achat</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
