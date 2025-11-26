import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Treatment } from '@/features/cattle/types';
import { referenceService, Medicament, Veterinarian } from '@/features/common/services/referenceService';

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
        dosage: '',
        veterinarian: '',
        notes: ''
    });
    const [medicaments, setMedicaments] = useState<Medicament[]>([]);
    const [veterinarians, setVeterinarians] = useState<Veterinarian[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadReferenceData = async () => {
            setLoading(true);
            const [medicamentsResponse, veterinariansResponse] = await Promise.all([
                referenceService.getMedicaments(),
                referenceService.getVeterinarians()
            ]);

            if (medicamentsResponse.success && medicamentsResponse.data) {
                setMedicaments(medicamentsResponse.data);
            }
            if (veterinariansResponse.success && veterinariansResponse.data) {
                setVeterinarians(veterinariansResponse.data);
            }
            setLoading(false);
        };

        if (open) {
            loadReferenceData();
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.type && formData.date && formData.product && formData.dosage && formData.veterinarian) {
            onAdd(formData);
            setFormData({
                type: '' as Treatment['type'],
                date: new Date().toISOString().split('T')[0],
                product: '',
                dosage: '',
                veterinarian: '',
                notes: ''
            });
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
                                value={formData.product.toString()}
                                onValueChange={(value) => setFormData({ ...formData, product: value })}
                                disabled={loading}
                            >
                                <SelectTrigger id="product">
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un médicament"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {medicaments.map((medicament) => (
                                        <SelectItem key={medicament.id} value={medicament.id.toString()}>
                                            {medicament.nom}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dosage">Dose *</Label>
                            <Input
                                id="dosage"
                                placeholder="Ex: 10ml"
                                value={formData.dosage}
                                onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="veterinarian">Intervenant *</Label>
                            <Select
                                value={formData.veterinarian.toString()}
                                onValueChange={(value) => setFormData({ ...formData, veterinarian: value })}
                                disabled={loading}
                            >
                                <SelectTrigger id="veterinarian">
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un intervenant"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {veterinarians.map((vet) => (
                                        <SelectItem key={vet.id} value={vet.id.toString()}>
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
