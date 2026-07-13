import React, { useState, useEffect, useMemo } from 'react';
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

interface AddTreatmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (treatment: Omit<Treatment, 'id'>) => void;
    cattleName: string;
}

export const AddTreatmentModal: React.FC<AddTreatmentModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        type: '' as Treatment['type'],
        date: getTodayDate(),
        product: '',
        dosage: {
            quantity: 0,
            unit: 'ml',
            weight: 0,
            notes: ''
        },
        veterinarian: '',
        notes: ''
    });
    const [animalWeight, setAnimalWeight] = useState<number>(0);
    const [selectedMedicament, setSelectedMedicament] = useState<Medicament | null>(null);

    // Use React Query hooks for reference data
    const { data: medicamentsData, isLoading: medicamentsLoading } = useMedicaments();
    const { data: veterinariansData, isLoading: veterinariansLoading } = useVeterinarians();

    const medicaments = useMemo(() => medicamentsData?.data || [], [medicamentsData?.data]);
    const veterinarians = useMemo(() => veterinariansData?.data || [], [veterinariansData?.data]);
    const loading = medicamentsLoading || veterinariansLoading;


    // Update selected medicament when product changes
    useEffect(() => {
        if (formData.product) {
            const med = medicaments.find(m => m.id === formData.product);
            setSelectedMedicament(med || null);

            // Set default unit if available
            if (med?.dosage?.unit) {
                setFormData(prev => ({
                    ...prev,
                    dosage: { ...prev.dosage, unit: med.dosage!.unit }
                }));
            }
        } else {
            setSelectedMedicament(null);
        }
    }, [formData.product, medicaments]);

    // Calculate dose when weight or medicament changes
    useEffect(() => {
        if (selectedMedicament?.dosage?.weight && selectedMedicament.dosage.quantity && animalWeight > 0) {
            const dose = (animalWeight / selectedMedicament.dosage.weight) * selectedMedicament.dosage.quantity;
            setFormData(prev => ({
                ...prev,
                dosage: {
                    ...prev.dosage,
                    quantity: parseFloat(dose.toFixed(2)),
                    weight: animalWeight
                }
            }));
        }
    }, [selectedMedicament, animalWeight]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) newErrors.type = "Le type de traitement est obligatoire";
        if (!formData.date) newErrors.date = "La date est obligatoire";
        if (!formData.product) newErrors.product = "Le médicament est obligatoire";
        if (!formData.dosage.quantity) newErrors.dosage = "La dose est obligatoire";
        if (!formData.veterinarian) newErrors.veterinarian = "L'intervenant est obligatoire";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onAdd(formData);
            setFormData({
                type: '' as Treatment['type'],
                date: getTodayDate(),
                product: '',
                dosage: {
                    quantity: 0,
                    unit: 'ml',
                    weight: 0,
                    notes: ''
                },
                veterinarian: '',
                notes: ''
            });
            setAnimalWeight(0);
            setErrors({});
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un traitement</DialogTitle>
                    <DialogDescription>
                        Enregistrez un nouveau traitement pour {cattleName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type de traitement *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, type: value as Treatment['type'] });
                                    if (errors.type) setErrors({ ...errors, type: '' });
                                }}
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
                            {errors.type && <p className="text-sm text-red-500">{errors.type}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => {
                                    setFormData({ ...formData, date: e.target.value });
                                    if (errors.date) setErrors({ ...errors, date: '' });
                                }}
                                className={errors.date ? 'border-red-500' : ''}
                            />
                            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product">Médicament *</Label>
                            <Select
                                value={formData.product}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, product: value });
                                    if (errors.product) setErrors({ ...errors, product: '' });
                                }}
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
                            {errors.product && <p className="text-sm text-red-500">{errors.product}</p>}
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
                                    value={formData.dosage.quantity || ''}
                                    onChange={(e) => {
                                        setFormData({
                                            ...formData,
                                            dosage: { ...formData.dosage, quantity: parseFloat(e.target.value) }
                                        });
                                        if (errors.dosage) setErrors({ ...errors, dosage: '' });
                                    }}
                                    className={errors.dosage ? 'border-red-500' : ''}
                                />
                                {errors.dosage && <p className="text-sm text-red-500">{errors.dosage}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dosage-unite">Unité *</Label>
                                <Select
                                    value={formData.dosage.unit}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        dosage: { ...formData.dosage, unit: value }
                                    })}
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
                                value={formData.veterinarian}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, veterinarian: value });
                                    if (errors.veterinarian) setErrors({ ...errors, veterinarian: '' });
                                }}
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
                            {errors.veterinarian && <p className="text-sm text-red-500">{errors.veterinarian}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (optionnel)</Label>
                            <Textarea
                                id="notes"
                                placeholder="Observations ou remarques..."
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
