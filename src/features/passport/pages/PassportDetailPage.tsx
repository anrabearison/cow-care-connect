import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, FileText, Download, Trash2, Edit } from "lucide-react";
import { passportService } from "../services/passportService";
import { passportKeys, usePassport, useDeletePassport } from "../hooks";
import { Passport, PassportStatus } from "../types/passport.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { toast } from "sonner";

const STATUS_BADGES: Record<PassportStatus, { label: string; className: string }> = {
  DRAFT: { label: 'Brouillon', className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' },
  GENERATED: { label: 'Généré', className: 'bg-blue-100 text-blue-800 hover:bg-blue-100' },
  USED: { label: 'Utilisé', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  CANCELLED: { label: 'Annulé', className: 'bg-red-100 text-red-800 hover:bg-red-100' },
};

const PassportDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast: uiToast } = useToast();
  const queryClient = useQueryClient();
  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const { data: passport, isLoading, error } = usePassport(id!);
  
  const deleteMutation = useDeletePassport({
    onSuccess: () => {
      uiToast({ title: "Succès", description: "Passeport supprimé avec succès" });
      navigate('/admin/passports');
    },
    onError: (error) => {
      console.error('Error deleting passport:', error);
      uiToast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    },
  });
  
  const handleGeneratePdf = async () => {
    if (!id) return;
    setIsGenerating(true);
    try {
      toast.loading('Génération du PDF en cours...', { id: 'pdf-generation' });
      await passportService.generatePdf(id);
      toast.success('PDF généré avec succès', { id: 'pdf-generation' });
      queryClient.invalidateQueries({ queryKey: passportKeys.detail(id) });
    } catch (error) {
      console.error('Error generating passport PDF:', error);
      toast.error('Erreur lors de la génération du PDF', { id: 'pdf-generation' });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleDownloadPdf = async () => {
    if (!id || !passport) return;
    setIsDownloading(true);
    try {
      const blob = await passportService.downloadPdf(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `passeport-${passport.passportNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Passeport téléchargé avec succès');
    } catch (error) {
      console.error('Error downloading passport:', error);
      toast.error('Erreur lors du téléchargement du passeport');
    } finally {
      setIsDownloading(false);
    }
  };
  
  const handleDelete = () => {
    if (id) {
      deleteMutation.mutate(id);
    }
  };
  
  const handleCancel = () => {
    navigate('/admin/passports');
  };
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  
  if (error || !passport) {
    return (
      <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Erreur</h1>
            <p className="text-muted-foreground mt-2">Passeport introuvable</p>
          </div>
        </div>
        <Button onClick={handleCancel}>
          Retour à la liste
        </Button>
      </div>
    );
  }
  
  const statusBadge = STATUS_BADGES[passport.status];
  
  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleCancel}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Détails du Passeport</h1>
            <p className="text-muted-foreground mt-2">Passeport {passport.passportNumber}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/admin/passports/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Modifier
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Supprimer
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Informations Générales</CardTitle>
            <Badge className={statusBadge.className}>{statusBadge.label}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Numéro de passeport</p>
              <p className="font-medium">{passport.passportNumber}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date d'émission</p>
              <p className="font-medium">{passport.issueDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieu d'émission</p>
              <p className="font-medium">{passport.location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Arrondissement</p>
              <p className="font-medium">{passport.district}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations du Demandeur</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nom du demandeur</p>
              <p className="font-medium">{passport.applicantName || passport.applicant?.name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Numéro CIN</p>
              <p className="font-medium">{passport.cinNumber || passport.applicant?.cinNumber || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date CIN</p>
              <p className="font-medium">{passport.cinIssueDate || passport.applicant?.cinIssueDate || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lieu de délivrance CIN</p>
              <p className="font-medium">{passport.cinIssueLocation || passport.applicant?.cinIssueLocation || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations de Résidence</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Commune de résidence</p>
              <p className="font-medium">{typeof passport.residenceCommune === 'string' ? passport.residenceCommune : (passport.residenceCommune?.name || passport.residenceCommuneLegacy || 'N/A')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Village</p>
              <p className="font-medium">{typeof passport.village === 'string' ? passport.village : (passport.village?.name || passport.villageLegacy || 'N/A')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kaominina</p>
              <p className="font-medium">{typeof passport.commune === 'string' ? passport.commune : (passport.commune?.name || passport.communeLegacy || 'N/A')}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Distrika</p>
              <p className="font-medium">{typeof passport.residenceDistrict === 'string' ? passport.residenceDistrict : (passport.residenceDistrict?.name || passport.residenceDistrictLegacy || 'N/A')}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-muted-foreground">Faritra (Région)</p>
              <p className="font-medium">{typeof passport.region === 'string' ? passport.region : (passport.region?.name || passport.regionLegacy || 'N/A')}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations de Transfert</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Commune du lieu d'achat</p>
            <p className="font-medium">{passport.purchaseCommune}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nombre total de bovins</p>
            <p className="font-medium">{passport.totalCattle}</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Informations de Vérification</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Date de vérification</p>
              <p className="font-medium">{passport.verificationDate}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Date de l'arrêté</p>
              <p className="font-medium">{passport.arreteDate}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Bovins Inclus</CardTitle>
        </CardHeader>
        <CardContent>
          {passport.cattle && passport.cattle.length > 0 ? (
            <div className="space-y-2">
              {passport.cattle.map((hbc) => (
                <div key={hbc.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{hbc.herdBookCattle?.cattle?.name || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">{hbc.herdBookCattle?.nCarnet || 'N/A'}</p>
                  </div>
                  <Badge variant="outline">{hbc.herdBookCattle?.cattle?.character?.name || 'N/A'}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">Aucun bovin inclus</p>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          {passport.status === 'DRAFT' && (
            <Button
              onClick={handleGeneratePdf}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Générer le PDF
                </>
              )}
            </Button>
          )}
          
          {passport.status === 'GENERATED' && (
            <Button
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              variant="outline"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Téléchargement...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger le PDF
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>
      
      <ConfirmDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Supprimer le passeport"
        description={`Êtes-vous sûr de vouloir supprimer le passeport ${passport.passportNumber} ? Cette action est irréversible.`}
        loading={deleteMutation.isPending}
      />
    </div>
  );
};

export default PassportDetailPage;
