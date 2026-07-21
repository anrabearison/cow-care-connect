import React from 'react';
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
import { getTodayDate } from '@/utils/dateUtils';

const birthFormSchema = z.object({
    name: z.string().min(1, "Le nom du veau est obligatoire"),
    nickname: z.string().optional(),
    gender: z.string().min(1, "Le sexe est obligatoire"),
    birthDate: z.string().min(1, "La date de naissance est obligatoire"),
    brand: z.string().optional(),
    distinctiveSign: z.string().optional(),
    birthDescription: z.string().optional(),
});

type BirthFormValues = z.infer<typeof birthFormSchema>;

const buildDefaultValues = (): BirthFormValues => ({
    name: '',
    nickname: '',
    gender: '',
    birthDate: getTodayDate(),
    brand: '',
    distinctiveSign: '',
    birthDescription: '',
});

interface AddBirthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (calfData: Omit<Cattle, 'id' | 'events' | 'treatments' | 'source'>) => void;
    motherName: string;
    motherId?: string;
}

export const AddBirthModal: React.FC<AddBirthModalProps> = ({ open, onOpenChange, onAdd, motherName, motherId }) => {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<BirthFormValues>({
        resolver: zodResolver(birthFormSchema),
        defaultValues: buildDefaultValues(),
    });

    const gender = watch('gender');

    const onSubmit = (data: BirthFormValues) => {
        const calfData: Omit<Cattle, 'id' | 'events' | 'treatments' | 'source'> = {
            name: data.name,
            nickname: data.nickname || undefined,
            gender: data.gender as 'M' | 'F',
            birthDate: data.birthDate,
            character: {
                id: 'docile',
                name: 'Docile'
            },
            brand: data.brand || undefined,
            distinctiveSign: data.distinctiveSign || undefined,
            // photo, status, source removed as not supported by backend on birth create
        };

        onAdd(calfData);
        reset(buildDefaultValues());
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset(buildDefaultValues());
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Enregistrer une naissance</DialogTitle>
                    <DialogDescription>
                        Enregistrez la naissance d'un veau pour {motherName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom du veau *</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Petit Vato"
                                    {...register('name')}
                                    className={errors.name ? 'border-red-500' : ''}
                                />
                                {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nickname">Surnom</Label>
                                <Input
                                    id="nickname"
                                    placeholder="Ex: Vato"
                                    {...register('nickname')}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Sexe *</Label>
                                <Select
                                    value={gender || undefined}
                                    onValueChange={(value) => setValue('gender', value, { shouldValidate: true })}
                                >
                                    <SelectTrigger id="gender" className={errors.gender ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Sélectionner le sexe" />
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Marque</Label>
                                <Input
                                    id="brand"
                                    placeholder="Ex: M-001"
                                    {...register('brand')}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="distinctiveSign">Signe particulier</Label>
                                <Input
                                    id="distinctiveSign"
                                    placeholder="Ex: Tache blanche"
                                    {...register('distinctiveSign')}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="birthDescription">Description de la naissance (optionnel)</Label>
                            <Textarea
                                id="birthDescription"
                                placeholder="Ex: Naissance sans complications, poids 35kg"
                                {...register('birthDescription')}
                                rows={3}
                            />
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">
                                <strong>Mère:</strong> {motherName}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Le veau sera automatiquement enregistré comme "Né dans le troupeau" avec la catégorie "Veau".
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
