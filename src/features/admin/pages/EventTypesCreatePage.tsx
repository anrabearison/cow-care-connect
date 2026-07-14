import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateEventType } from "@/features/admin/hooks/eventTypesHooks";
import { CreateEventTypeData } from "@/features/admin/services/eventTypesService";
import { ArrowLeft } from "lucide-react";

const initialFormState: CreateEventTypeData = {
  name: "",
  description: "",
  icon: "",
};

const EventTypesCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateEventTypeData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createEventTypeMutation = useCreateEventType();

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Le nom est requis";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    createEventTypeMutation.mutate(formData);
    toast({
      title: "Succès",
      description: "Type d'événement créé avec succès",
    });
    navigate("/admin/event-types");
  };

  const handleCancel = () => {
    if (formData.name || formData.description || formData.icon) {
      if (confirm("Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.")) {
        navigate("/admin/event-types");
      }
    } else {
      navigate("/admin/event-types");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouveau type d'événement</h1>
          <p className="text-muted-foreground mt-2">Créer un nouveau type d'événement</p>
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
          <Button type="button" variant="outline" onClick={handleCancel} disabled={createEventTypeMutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={createEventTypeMutation.isPending}>
            {createEventTypeMutation.isPending ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EventTypesCreatePage;
