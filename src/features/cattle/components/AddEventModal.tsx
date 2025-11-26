import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CattleEvent } from '@/features/cattle/types';
import { referenceService } from '@/features/common/services/referenceService';
import { TypeEvenement } from '@/features/events/types';

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (event: Omit<CattleEvent, 'id'>) => void;
    cattleName: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const [formData, setFormData] = useState({
        type: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        details: ''
    });
    const [eventTypes, setEventTypes] = useState<TypeEvenement[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadEventTypes = async () => {
            setLoading(true);
            const response = await referenceService.getEventTypes();
            if (response.success && response.data) {
                setEventTypes(response.data);
            }
            setLoading(false);
        };

        if (open) {
            loadEventTypes();
        }
    }, [open]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.type && formData.date && formData.description) {
            onAdd(formData);
            setFormData({
                type: 0,
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
                                value={formData.type.toString()}
                                onValueChange={(value) => setFormData({ ...formData, type: parseInt(value) })}
                                disabled={loading}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un type"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {eventTypes.map((eventType) => (
                                        <SelectItem key={eventType.id} value={eventType.id.toString()}>
                                            {eventType.nom}
                                        </SelectItem>
                                    ))}
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
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
