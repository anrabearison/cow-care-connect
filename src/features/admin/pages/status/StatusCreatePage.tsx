import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useCreateStatus } from "../../hooks/statusHooks";
import { CreateStatusData } from "@/features/admin/services/statusService";
import { ArrowLeft } from "lucide-react";

const initialFormState: CreateStatusData = {
  name: "",
  description: "",
};

const StatusCreatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState<CreateStatusData>(initialFormState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createStatusMutation = useCreateStatus();

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

    createStatusMutation.mutate(formData);
    toast({
      title: "Succès",
      description: "Statut créé avec succès",
    });
    navigate("/admin/status");
  };

  const handleCancel = () => {
    if (formData.name || formData.description) {
      if (confirm("Voulez-vous vraiment annuler ? Les modifications non sauvegardées seront perdues.")) {
        navigate("/admin/status");
      }
    } else {
      navigate("/admin/status");
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Retour">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouveau statut</h1>
          <p className="text-muted-foreground mt-2">Créer un nouveau statut</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Nom *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nom du statut"
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Description du statut"
            rows={3}
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={createStatusMutation.isPending}>
            Annuler
          </Button>
          <Button type="submit" disabled={createStatusMutation.isPending}>
            {createStatusMutation.isPending ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default StatusCreatePage;
