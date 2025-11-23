import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Treatment } from '@/features/cattle/types';

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
        produit: '',
        dose: '',
        veterinaire: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.type && formData.date && formData.produit && formData.dose && formData.veterinaire) {
            onAdd(formData);
            setFormData({
                type: '' as Treatment['type'],
                date: new Date().toISOString().split('T')[0],
                produit: '',
                dose: '',
                veterinaire: '',
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
                            <Label htmlFor="produit">Médicament *</Label>
                            <Select
                                value={formData.produit}
                                onValueChange={(value) => setFormData({ ...formData, produit: value })}
                            >
                                <SelectTrigger id="produit">
                                    <SelectValue placeholder="Sélectionner un médicament" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="M001">Amoxicilline</SelectItem>
                                    <SelectItem value="M002">Vaccin polyvalent</SelectItem>
                                    <SelectItem value="M003">Ivermectine</SelectItem>
                                    <SelectItem value="M004">Vaccin veau</SelectItem>
                                    <SelectItem value="M005">Vaccin FMD</SelectItem>
                                    <SelectItem value="M006">Vitamines prénatales</SelectItem>
                                    <SelectItem value="M007">Calcium injectable</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="dose">Dose *</Label>
                            <Input
                                id="dose"
                                placeholder="Ex: 10ml"
                                value={formData.dose}
                                onChange={(e) => setFormData({ ...formData, dose: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="veterinaire">Intervenant *</Label>
                            <Select
                                value={formData.veterinaire}
                                onValueChange={(value) => setFormData({ ...formData, veterinaire: value })}
                            >
                                <SelectTrigger id="veterinaire">
                                    <SelectValue placeholder="Sélectionner un intervenant" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="V001">Dr. Rakoto</SelectItem>
                                    <SelectItem value="V002">Razafy</SelectItem>
                                    <SelectItem value="V003">Dr. Nivo</SelectItem>
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
                        <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
