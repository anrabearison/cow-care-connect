import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useEvent, useUpdateEvent } from '../../hooks/eventsHooks';
import { Loader2 } from 'lucide-react';
import { ConfirmDialog } from '@/components/shared/ConfirmDialog';

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

const EventsEditPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const updateEventMutation = useUpdateEvent();
  const { data: event, isLoading, error } = useEvent(id!);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [pendingData, setPendingData] = useState<FormState | null>(null);

  const initialData = useMemo(() => {
    if (!event || !event.data) return initialFormState;
    return {
      cattleId: event.data.cattleId || '',
      eventTypeId: event.data.eventTypeId || '',
      type: event.data.type || '',
      date: event.data.date || '',
      description: event.data.description || '',
      details: event.data.details || '',
    };
  }, [event]);

  const [formData, setFormData] = useState<FormState>(initialData);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
          <p className="text-muted-foreground mt-2">Événement introuvable</p>
        </div>
        <Button onClick={() => navigate('/admin/events')}>Retour à la liste</Button>
      </div>
    );
  }

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.cattleId) nextErrors.cattleId = 'Le bovin est obligatoire';
    if (!formData.date) nextErrors.date = 'La date est obligatoire';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;
    setPendingData(formData);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingData || !id) return;
    updateEventMutation.mutate({
      id,
      data: {
        cattleId: pendingData.cattleId,
        eventTypeId: pendingData.eventTypeId || undefined,
        type: pendingData.type || undefined,
        date: pendingData.date,
        description: pendingData.description,
        details: pendingData.details || undefined,
      },
    }, {
      onSuccess: () => {
        toast({ title: 'Succès', description: 'Événement mis à jour avec succès' });
        navigate(`/admin/events/${id}`);
      },
      onError: (error) => {
        toast({ 
          title: 'Erreur', 
          description: error instanceof Error ? error.message : 'Erreur lors de la mise à jour',
          variant: 'destructive' 
        });
      },
    });
    setIsConfirmDialogOpen(false);
    setPendingData(null);
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Modifier l'événement</h1>
        <p className="text-muted-foreground mt-2">Modifier les informations de l'événement</p>
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
          <Button type="button" variant="outline" onClick={() => navigate(`/admin/events/${id}`)}>Annuler</Button>
          <Button type="submit">Mettre à jour</Button>
        </div>
      </form>

      <ConfirmDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
        title="Modifier l'événement"
        description={`Êtes-vous sûr de vouloir modifier l'événement pour le ${pendingData?.date} ?`}
        onConfirm={handleConfirmUpdate}
        confirmText="Modifier"
        cancelText="Annuler"
        loading={updateEventMutation.isPending}
      />
    </div>
  );
};

export default EventsEditPage;
