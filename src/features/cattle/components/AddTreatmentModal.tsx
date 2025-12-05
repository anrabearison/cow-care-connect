import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Treatment } from '@/features/cattle/types';
import { useMedicaments, useVeterinarians } from '@/features/common/hooks/useReferences';
import { Medicament } from '@/features/common/types';

interface AddTreatmentModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (treatment: Omit<Treatment, 'id'>) => void;
    cattleName: string;
}

export const AddTreatmentModal: React.FC<AddTreatmentModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const [formData, setFormData] = useState({
        type: '' as Treatment['type'],
        date: new Date().toISOString().split('T')[0],
        product: '',
        dosage: {
            quantite: 0,
            unite: 'ml',
            animal_poids: 0,
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

    const medicaments = medicamentsData?.data || [];
    const veterinarians = veterinariansData?.data || [];
    const loading = medicamentsLoading || veterinariansLoading;


    // Update selected medicament when product changes
    useEffect(() => {
        if (formData.product) {
            const med = medicaments.find(m => m.id === formData.product);
            setSelectedMedicament(med || null);

            // Set default unit if available
            if (med?.dosage?.unite) {
                setFormData(prev => ({
                    ...prev,
                    dosage: { ...prev.dosage, unite: med.dosage!.unite }
                }));
            }
        } else {
            setSelectedMedicament(null);
        }
    }, [formData.product, medicaments]);

    // Calculate dose when weight or medicament changes
    useEffect(() => {
        if (selectedMedicament?.dosage?.poids && selectedMedicament.dosage.quantite && animalWeight > 0) {
            const dose = (animalWeight / selectedMedicament.dosage.poids) * selectedMedicament.dosage.quantite;
            setFormData(prev => ({
                ...prev,
                dosage: {
                    ...prev.dosage,
                    quantite: parseFloat(dose.toFixed(2)),
                    animal_poids: animalWeight
                }
            }));
        }
    }, [selectedMedicament, animalWeight]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.type && formData.date && formData.product && formData.dosage.quantite && formData.veterinarian) {
            // @ts-ignore - dosage structure matches the updated type but TS might complain due to union type
            onAdd(formData);
            setFormData({
                type: '' as Treatment['type'],
                date: new Date().toISOString().split('T')[0],
                product: '',
                dosage: {
                    quantite: 0,
                    unite: 'ml',
                    animal_poids: 0,
                    notes: ''
                },
                veterinarian: '',
                notes: ''
            });
            setAnimalWeight(0);
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
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
                                onValueChange={(value) => setFormData({ ...formData, type: value as Treatment['type'] })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Antibiotique">Antibiotique</SelectItem>
                                    <SelectItem value="Vaccin">Vaccin</SelectItem>
                                    <SelectItem value="Vermifuge">Vermifuge</SelectItem>
                                    <SelectItem value="Anti-inflammatoire">Anti-inflammatoire</SelectItem>
                                    <SelectItem value="Vitamine">Vitamine</SelectItem>
                                    <SelectItem value="Autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="date">Date *</Label>
                            <Input
                                id="date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="product">Médicament *</Label>
                            <Select
                                value={formData.product}
                                onValueChange={(value) => {
                                    console.log('Selected medicament ID:', value);
                                    setFormData({ ...formData, product: value });
                                }}
                                disabled={loading}
                            >
                                <SelectTrigger id="product">
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un médicament"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {medicaments.length === 0 && !loading && (
                                        <div className="p-2 text-sm text-muted-foreground">Aucun médicament disponible</div>
                                    )}
                                    {medicaments.map((medicament) => (
                                        <SelectItem key={medicament.id} value={medicament.id}>
                                            {medicament.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                                    Dosage recommandé: {selectedMedicament.dosage.quantite}
                                    {selectedMedicament.dosage.unite}
                                    {selectedMedicament.dosage.poids &&
                                        ` / ${selectedMedicament.dosage.poids}${selectedMedicament.dosage.unite_poids || 'kg'}`
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
                                    value={formData.dosage.quantite || ''}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        dosage: { ...formData.dosage, quantite: parseFloat(e.target.value) }
                                    })}
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dosage-unite">Unité *</Label>
                                <Select
                                    value={formData.dosage.unite}
                                    onValueChange={(value) => setFormData({
                                        ...formData,
                                        dosage: { ...formData.dosage, unite: value }
                                    })}
                                >
                                    <SelectTrigger id="dosage-unite">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ml">ml</SelectItem>
                                        <SelectItem value="mg">mg</SelectItem>
                                        <SelectItem value="g">g</SelectItem>
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
                                    console.log('Selected veterinarian ID:', value);
                                    setFormData({ ...formData, veterinarian: value });
                                }}
                                disabled={loading}
                            >
                                <SelectTrigger id="veterinarian">
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un intervenant"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {veterinarians.length === 0 && !loading && (
                                        <div className="p-2 text-sm text-muted-foreground">Aucun intervenant disponible</div>
                                    )}
                                    {veterinarians.map((vet) => (
                                        <SelectItem key={vet.id} value={vet.id}>
                                            {vet.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
