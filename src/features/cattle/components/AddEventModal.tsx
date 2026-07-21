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
import { CattleEvent } from '@/features/cattle/types';
import { useEventTypes } from '@/features/common/hooks/useReferences';
import { getEventTypeLabel } from '@/features/events/utils';
import { getTodayDate } from '@/utils/dateUtils';

const eventFormSchema = z.object({
    type: z.string().min(1, "Le type d'événement est obligatoire"),
    date: z.string().min(1, "La date est obligatoire"),
    description: z.string().min(1, "La description est obligatoire"),
    details: z.string().optional(),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const buildDefaultValues = (): EventFormValues => ({
    type: '',
    date: getTodayDate(),
    description: '',
    details: '',
});

interface AddEventModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (event: Omit<CattleEvent, 'id'>) => void;
    cattleName: string;
}

export const AddEventModal: React.FC<AddEventModalProps> = ({ open, onOpenChange, onAdd, cattleName }) => {
    const { data: eventTypesData, isLoading: loading } = useEventTypes();
    const eventTypes = Array.isArray(eventTypesData?.data) ? eventTypesData.data : [];

    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<EventFormValues>({
        resolver: zodResolver(eventFormSchema),
        defaultValues: buildDefaultValues(),
    });

    const type = watch('type');

    const onSubmit = (data: EventFormValues) => {
        onAdd(data);
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
            <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un événement</DialogTitle>
                    <DialogDescription>
                        Enregistrez un nouvel événement pour {cattleName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Type d'événement *</Label>
                            <Select
                                value={type || undefined}
                                onValueChange={(value) => setValue('type', value, { shouldValidate: true })}
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
                            <Label htmlFor="description">Description *</Label>
                            <Input
                                id="description"
                                placeholder="Ex: Vaccination annuelle complète"
                                {...register('description')}
                                className={errors.description ? 'border-red-500' : ''}
                            />
                            {errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="details">Détails (optionnel)</Label>
                            <Textarea
                                id="details"
                                placeholder="Informations complémentaires..."
                                {...register('details')}
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
