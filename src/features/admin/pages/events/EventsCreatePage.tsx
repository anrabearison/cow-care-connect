import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreateEvent } from '../../hooks/eventsHooks';

interface FormState {
  cattleId: string;
  eventTypeId: string;
  type: string;
  date: string;
  description: string;
  details: string;
}

const initialFormState: FormState = {
  cattleId: '',
  eventTypeId: '',
  type: '',
  date: '',
  description: '',
  details: '',
};

const EventsCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const createEventMutation = useCreateEvent();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.cattleId) nextErrors.cattleId = 'Le bovin est obligatoire';
    if (!formData.date) nextErrors.date = 'La date est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createEventMutation.mutate({
      cattleId: formData.cattleId,
      eventTypeId: formData.eventTypeId || undefined,
      type: formData.type || undefined,
      date: formData.date,
      description: formData.description,
      details: formData.details || undefined,
    });
    toast({ title: 'Succès', description: 'Événement créé avec succès' });
    navigate('/admin/events');
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Nouvel événement</h1>
        <p className="text-muted-foreground mt-2">Créer un événement pour un bovin</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="cattleId">Bovin *</Label>
            <Input id="cattleId" value={formData.cattleId} onChange={(e) => setFormData({ ...formData, cattleId: e.target.value })} className={errors.cattleId ? 'border-red-500' : ''} />
            {errors.cattleId && <p className="text-sm text-red-500">{errors.cattleId}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Date *</Label>
            <Input id="date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className={errors.date ? 'border-red-500' : ''} />
            {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="eventTypeId">Type d'événement</Label>
            <Input id="eventTypeId" value={formData.eventTypeId} onChange={(e) => setFormData({ ...formData, eventTypeId: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Type</Label>
            <Input id="type" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="details">Détails</Label>
            <Textarea id="details" value={formData.details} onChange={(e) => setFormData({ ...formData, details: e.target.value })} rows={3} />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/admin/events')}>Annuler</Button>
          <Button type="submit">Créer</Button>
        </div>
      </form>
    </div>
  );
};

export default EventsCreatePage;
