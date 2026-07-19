import { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useEventType, useUpdateEventType } from "../../hooks/eventTypesHooks";
import { UpdateEventTypeData } from "@/features/admin/services/eventTypesService";
import { ArrowLeft, Loader2 } from "lucide-react";

const initialFormState: UpdateEventTypeData = {
  name: "",
  description: "",
  icon: "",
};

const EventTypesEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  
  const { data: eventType, isLoading, error } = useEventType(id || "");
  const updateEventTypeMutation = useUpdateEventType();

  const initialData = useMemo(() => {
    if (eventType?.data) {
      return {
        name: eventType.data.name,
        description: eventType.data.description || "",
        icon: eventType.data.icon || "",
      };
    }
    return initialFormState;
  }, [eventType?.data]);

  const [formData, setFormData] = useState<UpdateEventTypeData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) {
      newErrors.name = "Le nom est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !id) return;

    updateEventTypeMutation.mutate({ id, data: formData });
    toast({
      title: "Succès",
      description: "Type d'événement mis à jour avec succès",
    });
    navigate("/admin/event-types");
  };

  const handleCancel = () => {
    navigate("/admin/event-types");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !eventType?.data) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Type d'événement introuvable</p>
          </div>
        </div>
        <Button onClick={handleCancel}>Retour à la liste</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Modifier le type d'événement</h1>
          <p className="text-muted-foreground mt-2">Modifier les informations du type d'événement</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom du type d'événement"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="icon">Icône</Label>
          <Input
            id="icon"
            value={formData.icon}
            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
            placeholder="Icône"
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du type d'événement"
            rows={3}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={updateEventTypeMutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={updateEventTypeMutation.isPending}>
            {updateEventTypeMutation.isPending ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventTypesEditPage;
