import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import HerdBookForm, { HerdBookFormValues } from "../components/HerdBookForm";
import { useCreateHerdBook } from "../hooks/herdBooksHooks";

const HerdBookCreatePage = () => {
  const navigate = useNavigate();
  const { toast: uiToast } = useToast();

  const initialData = useMemo<HerdBookFormValues>(() => ({
    reference: "",
    year: new Date().getFullYear(),
    description: "",
    ownerId: "",
  }), []);

  const createMutation = useCreateHerdBook({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Livre de troupeau créé avec succès" });
      navigate('/admin/herd-books');
    },
    onError: (error) => {
      const msg = error instanceof Error ? error.message : "Erreur lors de la création";
      uiToast({ title: "Erreur", description: msg, variant: "destructive" });
    },
  });

  const handleSubmit = (data: HerdBookFormValues) => {
    createMutation.mutate({
      reference: data.reference,
      year: data.year,
      description: data.description || undefined,
      ownerId: data.ownerId || undefined,
    });
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/herd-books')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Nouveau livre de troupeau</h1>
          <p className="text-muted-foreground mt-2">Créer un nouveau livre de troupeau</p>
        </div>
      </div>

      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <HerdBookForm
          mode="create"
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/admin/herd-books')}
          isPending={createMutation.isPending}
        />
      </div>
    </div>
  );
};

export default HerdBookCreatePage;
