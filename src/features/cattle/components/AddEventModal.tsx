import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CattleEvent } from '@/features/cattle/types';

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (event: Omit<CattleEvent, 'id'>) => void;
    cattleName: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const [formData, setFormData] = useState({
        type: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        details: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.type && formData.date && formData.description) {
            onAdd(formData);
            setFormData({
                type: '',
                date: new Date().toISOString().split('T')[0],
                description: '',
                details: ''
            });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un événement</DialogTitle>
                    <DialogDescription>
                        Enregistrez un nouvel événement pour {cattleName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type d'événement *</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Sélectionner un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TE001">Naissance</SelectItem>
                                    <SelectItem value="TE002">Changement de pâturage</SelectItem>
                                    <SelectItem value="TE003">Vaccination</SelectItem>
                                    <SelectItem value="TE004">Visite vétérinaire</SelectItem>
                                    <SelectItem value="TE005">Pesée</SelectItem>
                                    <SelectItem value="TE006">Autre</SelectItem>
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
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                placeholder="Ex: Vaccination annuelle complète"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details">Détails (optionnel)</Label>
                            <Textarea
                                id="details"
                                placeholder="Informations complémentaires..."
                                value={formData.details}
                                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
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
