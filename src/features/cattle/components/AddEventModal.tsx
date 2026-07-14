import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { CattleEvent } from '@/features/cattle/types';
import { useEventTypes } from '@/features/common/hooks/useReferences';
import { getEventTypeLabel } from '@/features/events/utils';
import { getTodayDate } from '@/utils/dateUtils';

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (event: Omit<CattleEvent, 'id'>) => void;
    cattleName: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        type: '',
        date: new Date().toISOString().split('T')[0],
        description: '',
        details: ''
    });

    const { data: eventTypesData, isLoading: loading } = useEventTypes();
    const eventTypes = Array.isArray(eventTypesData?.data) ? eventTypesData.data : [];

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.type) newErrors.type = "Le type d'événement est obligatoire";
        if (!formData.date) newErrors.date = "La date est obligatoire";
        if (!formData.description) newErrors.description = "La description est obligatoire";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onAdd(formData);
            setFormData({
                type: '',
                date: getTodayDate(),
                description: '',
                details: ''
            });
            setErrors({});
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
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
                                value={formData.type || undefined}
                                onValueChange={(value) => {
                                    setFormData({ ...formData, type: value });
                                    if (errors.type) setErrors({ ...errors, type: '' });
                                }}
                                disabled={loading}
                            >
                                <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                                    <SelectValue placeholder={loading ? "Chargement..." : "Sélectionner un type"} />
                                </SelectTrigger>
                                <SelectContent position="popper" className="z-[100]">
                                    {!loading && eventTypes.length === 0 && (
                                        <div className="p-2 text-sm text-muted-foreground">
                                            Aucun type d'événement disponible
                                        </div>
                                    )}
                                    {eventTypes.map((eventType) => (
                                        <SelectItem key={eventType.id} value={eventType.id}>
                                            {getEventTypeLabel(eventType)}
                                        </SelectItem>
                                    ))}
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
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                placeholder="Ex: Vaccination annuelle complète"
                                value={formData.description}
                                onChange={(e) => {
                                    setFormData({ ...formData, description: e.target.value });
                                    if (errors.description) setErrors({ ...errors, description: '' });
                                }}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
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
