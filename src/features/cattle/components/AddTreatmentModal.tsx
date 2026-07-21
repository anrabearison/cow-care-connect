import React, { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Treatment } from '@/features/cattle/types';
import { useMedicaments, useVeterinarians } from '@/features/common/hooks/useReferences';
import { Medicament } from '@/features/common/types';
import { getTodayDate } from '@/utils/dateUtils';

const treatmentFormSchema = z.object({
    type: z.enum(['ANTIBIOTIQUE', 'VACCIN', 'VERMIFUGE', 'ANTI_INFLAMMATOIRE', 'VITAMINE', 'AUTRE'], {
        errorMap: () => ({ message: "Le type de traitement est obligatoire" }),
    }),
    date: z.string().min(1, "La date est obligatoire"),
    product: z.string().min(1, "Le médicament est obligatoire"),
    dosage: z.object({
        quantity: z.coerce.number().min(0.01, "La dose est obligatoire"),
        unit: z.string(),
        weight: z.coerce.number().optional(),
        notes: z.string().optional(),
    }),
    veterinarian: z.string().min(1, "L'intervenant est obligatoire"),
    notes: z.string().optional(),
});

type TreatmentFormValues = z.infer<typeof treatmentFormSchema>;

const buildDefaultValues = (): TreatmentFormValues => ({
    type: '' as TreatmentFormValues['type'],
    date: getTodayDate(),
    product: '',
    dosage: {
        quantity: 0,
        unit: 'ml',
        weight: 0,
        notes: '',
    },
    veterinarian: '',
    notes: '',
});

interface AddTreatmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (treatment: Omit<Treatment, 'id'>) => void;
    cattleName: string;
}

export const AddTreatmentModal: React.FC<AddTreatmentModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    // Poids de l'animal : sert uniquement à calculer la dose recommandée,
    // ne fait pas partie du payload Treatment soumis.
    const [animalWeight, setAnimalWeight] = useState<number>(0);
    const [selectedMedicament, setSelectedMedicament] = useState<Medicament | null>(null);

    // Use React Query hooks for reference data
    const { data: medicamentsData, isLoading: medicamentsLoading } = useMedicaments();
    const { data: veterinariansData, isLoading: veterinariansLoading } = useVeterinarians();

    const medicaments = useMemo(() => Array.isArray(medicamentsData?.data) ? medicamentsData.data : [], [medicamentsData?.data]);
    const veterinarians = useMemo(() => Array.isArray(veterinariansData?.data) ? veterinariansData.data : [], [veterinariansData?.data]);
    const loading = medicamentsLoading || veterinariansLoading;

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<TreatmentFormValues>({
        resolver: zodResolver(treatmentFormSchema),
        defaultValues: buildDefaultValues(),
    });

    const type = watch('type');
    const product = watch('product');
    const dosageUnit = watch('dosage.unit');
    const veterinarian = watch('veterinarian');

    // Update selected medicament when product changes
    useEffect(() => {
        if (product) {
            const med = medicaments.find(m => m.id === product);
            setSelectedMedicament(med || null);

            // Set default unit if available
            if (med?.dosage?.unit) {
                setValue('dosage.unit', med.dosage.unit);
            }
        } else {
            setSelectedMedicament(null);
        }
    }, [product, medicaments, setValue]);

    // Calculate dose when weight or medicament changes
    useEffect(() => {
        if (selectedMedicament?.dosage?.weight && selectedMedicament.dosage.quantity && animalWeight > 0) {
            const dose = (animalWeight / selectedMedicament.dosage.weight) * selectedMedicament.dosage.quantity;
            setValue('dosage.quantity', parseFloat(dose.toFixed(2)));
            setValue('dosage.weight', animalWeight);
        }
    }, [selectedMedicament, animalWeight, setValue]);

    const onSubmit = (data: TreatmentFormValues) => {
        onAdd(data);
        reset(buildDefaultValues());
        setAnimalWeight(0);
        onOpenChange(false);
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset(buildDefaultValues());
            setAnimalWeight(0);
        }
        onOpenChange(nextOpen);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un traitement</DialogTitle>
                    <DialogDescription>
                        Enregistrez un nouveau traitement pour {cattleName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type de traitement *</Label>
                            <Select
                                value={type}
                                onValueChange={(value) => setValue('type', value as TreatmentFormValues['type'], { shouldValidate: true })}
                            >
                                <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ANTIBIOTIQUE">Antibiotique</SelectItem>
                                    <SelectItem value="VACCIN">Vaccin</SelectItem>
                                    <SelectItem value="VERMIFUGE">Vermifuge</SelectItem>
                                    <SelectItem value="ANTI_INFLAMMATOIRE">Anti-inflammatoire</SelectItem>
                                    <SelectItem value="VITAMINE">Vitamine</SelectItem>
                                    <SelectItem value="AUTRE">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                {...register('date')}
                                className={errors.date ? 'border-red-500' : ''}
                            />
                            {errors.date && <p className="text-sm text-red-500">{errors.date.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product">Médicament *</Label>
                            <Select
                                value={product}
                                onValueChange={(value) => setValue('product', value, { shouldValidate: true })}
                                disabled={loading}
                            >
                                <SelectTrigger id="product" className={errors.product ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un médicament"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {medicaments.length === 0 && !loading && (
                                        <div className="p-2 text-sm text-muted-foreground">Aucun médicament disponible</div>
                                    )}
                                    {medicaments.map((medicament) => (
                                        <SelectItem key={medicament.id} value={medicament.id}>
                                            {medicament.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.product && <p className="text-sm text-red-500">{errors.product.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="weight">Poids de l'animal (kg)</Label>
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                value={animalWeight || ''}
                                onChange={(e) => setAnimalWeight(parseFloat(e.target.value))}
                                placeholder="Ex: 300"
                            />
                        </div>

                        {selectedMedicament?.dosage && (
                            <div className="p-3 bg-blue-50 rounded-md text-sm">
                                <p className="font-medium text-blue-900">
                                    Dosage recommandé: {selectedMedicament.dosage.quantity}
                                    {selectedMedicament.dosage.unit}
                                    {selectedMedicament.dosage.weight &&
                                        ` / ${selectedMedicament.dosage.weight}${selectedMedicament.dosage.weightUnit || 'kg'}`
                                    }
                                </p>
                                {selectedMedicament.dosage.notes && (
                                    <p className="text-blue-700 mt-1 italic">{selectedMedicament.dosage.notes}</p>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-2">
                                <Label htmlFor="dosage-quantite">Dose administrée *</Label>
                                <Input
                                    id="dosage-quantite"
                                    type="number"
                                    step="0.01"
                                    {...register('dosage.quantity', { valueAsNumber: true })}
                                    className={errors.dosage?.quantity ? 'border-red-500' : ''}
                                />
                                {errors.dosage?.quantity && <p className="text-sm text-red-500">{errors.dosage.quantity.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dosage-unite">Unité *</Label>
                                <Select
                                    value={dosageUnit}
                                    onValueChange={(value) => setValue('dosage.unit', value)}
                                >
                                    <SelectTrigger id="dosage-unite">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ML">ml</SelectItem>
                                        <SelectItem value="MG">mg</SelectItem>
                                        <SelectItem value="G">g</SelectItem>
                                        <SelectItem value="UI">UI</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="veterinarian">Intervenant *</Label>
                            <Select
                                value={veterinarian}
                                onValueChange={(value) => setValue('veterinarian', value, { shouldValidate: true })}
                                disabled={loading}
                            >
                                <SelectTrigger id="veterinarian" className={errors.veterinarian ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un intervenant"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {veterinarians.length === 0 && !loading && (
                                        <div className="p-2 text-sm text-muted-foreground">Aucun intervenant disponible</div>
                                    )}
                                    {veterinarians.map((vet) => (
                                        <SelectItem key={vet.id} value={vet.id}>
                                            {vet.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.veterinarian && <p className="text-sm text-red-500">{errors.veterinarian.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (optionnel)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Observations ou remarques..."
                                {...register('notes')}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
