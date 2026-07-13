import { memo, useCallback, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { getTodayDate } from '@/utils/dateUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { useHerdBookCattle } from '@/features/herdbook/hooks';
import { CreatePassportDto } from '../types/passport.types';

// ─── Schéma de validation Zod ────────────────────────────────────────────────

const passportSchema = z.object({
  passportNumber: z
    .string()
    .min(1, 'Le numéro de passeport est requis')
    .regex(/^[A-Z0-9-]+$/, 'Format invalide (ex: PASS-2024-0001)'),
  location: z.string().min(1, "Le lieu d'émission est requis"),
  issueDate: z.string().min(1, "La date d'émission est requise"),
  district: z.string().min(1, "L'arrondissement est requis"),
  applicantName: z.string().min(2, 'Le nom du demandeur est requis (min. 2 caractères)'),
  cinNumber: z
    .string()
    .min(1, 'Le numéro CIN est requis')
    .regex(/^[\d\s]+$/, 'Le CIN doit contenir uniquement des chiffres et espaces'),
  cinIssueDate: z.string().min(1, 'La date du CIN est requise'),
  cinIssueLocation: z.string().min(1, 'Le lieu de délivrance du CIN est requis'),
  residenceCommune: z.string().min(1, 'La commune de résidence est requise'),
  village: z.string().min(1, 'Le village est requis'),
  commune: z.string().min(1, 'La kaominina est requise'),
  residenceDistrict: z.string().min(1, 'Le distrika est requis'),
  region: z.string().min(1, 'Le faritra est requis'),
  purchaseCommune: z.string().min(1, "La commune d'achat est requise"),
  verificationDate: z.string().min(1, 'La date de vérification est requise'),
  arreteDate: z.string().min(1, "La date de l'arrêté est requise"),
});

type PassportFormValues = z.infer<typeof passportSchema>;

// ─── Types ───────────────────────────────────────────────────────────────────

interface PassportGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: CreatePassportDto) => void;
  isGenerating?: boolean;
}

// ─── Sous-composant champ ────────────────────────────────────────────────────

const FormField = memo(function FormField({
  id,
  label,
  error,
  required = false,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
});

// ─── Contenu du formulaire (isolé + mémoïsé) ─────────────────────────────────
// IMPORTANT : Ce composant est wrappé avec memo() ET reçoit des callbacks stables
// (useCallback) depuis le parent. Ceci empêche la boucle infinie causée par le
// composant Presence de Radix UI qui setState sur les refs à chaque render.

interface PassportFormContentProps {
  onGenerate: (data: CreatePassportDto) => void;
  isGenerating?: boolean;
  onCancel: () => void;
  herdBookId: string;
}

const PassportFormContent = memo(function PassportFormContent({
  onGenerate,
  isGenerating,
  onCancel,
  herdBookId,
}: PassportFormContentProps) {
  const { data: herdBookCattleData } = useHerdBookCattle(herdBookId, 1, 50);
  const herdBookCattle = herdBookCattleData?.data ?? [];

  const today = useMemo(() => getTodayDate(), []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PassportFormValues>({
    resolver: zodResolver(passportSchema),
    defaultValues: {
      issueDate: today,
      verificationDate: today,
      arreteDate: today,
    },
  });

  const [cattleIds, setCattleIds] = useState<string[]>([]);

  // useCallback stable — ne dépend que de setCattleIds (stable par définition)
  const handleCattleToggle = useCallback((cattleId: string) => {
    setCattleIds((prev) =>
      prev.includes(cattleId)
        ? prev.filter((id) => id !== cattleId)
        : [...prev, cattleId]
    );
  }, []);

  const onSubmit = useCallback(
    (data: PassportFormValues) => {
      if (cattleIds.length === 0) {
        toast.error('Veuillez sélectionner au moins un bœuf');
        return;
      }
      onGenerate({
        ...data,
        herdBookId,
        totalCattle: cattleIds.length,
        cattleIds,
        passportNumber: data.passportNumber,
      });
    },
    [cattleIds, herdBookId, onGenerate]
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col min-h-0 flex-1">
      {/* Zone scrollable */}
      <div className="flex-1 overflow-y-auto px-6">
        <div className="space-y-6 pb-6 pt-2">

          {/* Sélection des bœufs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sélection des Bœufs</CardTitle>
              <CardDescription>
                Sélectionnez les bœufs à inclure dans ce passeport (
                {cattleIds.length} sélectionné{cattleIds.length > 1 ? 's' : ''})
                {herdBookCattle.length === 50 && (
                  <span className="text-muted-foreground text-xs ml-1">
                    — Affichage limité aux 50 premiers
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-48 border rounded-md p-2 overflow-y-auto">
                <div className="space-y-2">
                  {herdBookCattle.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Aucun bovin trouvé dans ce livre de troupeau
                    </p>
                  ) : (
                    herdBookCattle.map((hbc) => (
                      <div
                        key={hbc.id}
                        className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                        onClick={() => handleCattleToggle(hbc.id)}
                      >
                        {/* Checkbox natif pour éviter le Presence de Radix UI */}
                        <input
                          type="checkbox"
                          id={`cattle-${hbc.id}`}
                          checked={cattleIds.includes(hbc.id)}
                          onChange={() => handleCattleToggle(hbc.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-gray-300 accent-primary cursor-pointer"
                        />
                        <Label
                          htmlFor={`cattle-${hbc.id}`}
                          className="flex-1 cursor-pointer flex items-center gap-2"
                        >
                          <span className="font-medium">{hbc.cattle?.name || 'N/A'}</span>
                          <Badge variant="outline" className="text-xs">
                            {hbc.n_carnet || 'N/A'}
                          </Badge>
                          <span className="text-muted-foreground text-sm">
                            — {hbc.cattle?.character?.name || 'N/A'}
                          </span>
                        </Label>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Informations d'émission */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations d'Émission</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField id="passportNumber" label="Numéro de Passeport" error={errors.passportNumber?.message} required>
                <Input
                  id="passportNumber"
                  placeholder="PASS-2024-0001"
                  {...register('passportNumber')}
                  className={errors.passportNumber ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="location" label="Lieu d'émission" error={errors.location?.message} required>
                <Input
                  id="location"
                  placeholder="Antananarivo"
                  {...register('location')}
                  className={errors.location ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="issueDate" label="Date d'émission" error={errors.issueDate?.message} required>
                <Input
                  id="issueDate"
                  type="date"
                  {...register('issueDate')}
                  className={errors.issueDate ? 'border-destructive' : ''}
                />
              </FormField>
              <div className="sm:col-span-2 lg:col-span-3">
                <FormField id="district" label="Arrondissement" error={errors.district?.message} required>
                  <Input
                    id="district"
                    placeholder="Antananarivo I"
                    {...register('district')}
                    className={errors.district ? 'border-destructive' : ''}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Informations du demandeur */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations du Demandeur</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="applicantName" label="Nom du demandeur" error={errors.applicantName?.message} required>
                <Input
                  id="applicantName"
                  placeholder="Jean Rasoanaivo"
                  {...register('applicantName')}
                  className={errors.applicantName ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="cinNumber" label="Numéro CIN" error={errors.cinNumber?.message} required>
                <Input
                  id="cinNumber"
                  placeholder="101 234 567 890"
                  {...register('cinNumber')}
                  className={errors.cinNumber ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="cinIssueDate" label="Date CIN" error={errors.cinIssueDate?.message} required>
                <Input
                  id="cinIssueDate"
                  type="date"
                  {...register('cinIssueDate')}
                  className={errors.cinIssueDate ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="cinIssueLocation" label="Lieu de délivrance CIN" error={errors.cinIssueLocation?.message} required>
                <Input
                  id="cinIssueLocation"
                  placeholder="Antananarivo"
                  {...register('cinIssueLocation')}
                  className={errors.cinIssueLocation ? 'border-destructive' : ''}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Informations de résidence */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de Résidence</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="residenceCommune" label="Commune de résidence" error={errors.residenceCommune?.message} required>
                <Input
                  id="residenceCommune"
                  placeholder="Antananarivo"
                  {...register('residenceCommune')}
                  className={errors.residenceCommune ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="village" label="Village (Fokontany)" error={errors.village?.message} required>
                <Input
                  id="village"
                  placeholder="67 Ha"
                  {...register('village')}
                  className={errors.village ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="commune" label="Kaominina" error={errors.commune?.message} required>
                <Input
                  id="commune"
                  placeholder="Antananarivo Renivohitra"
                  {...register('commune')}
                  className={errors.commune ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="residenceDistrict" label="Distrika" error={errors.residenceDistrict?.message} required>
                <Input
                  id="residenceDistrict"
                  placeholder="Antananarivo I"
                  {...register('residenceDistrict')}
                  className={errors.residenceDistrict ? 'border-destructive' : ''}
                />
              </FormField>
              <div className="sm:col-span-2">
                <FormField id="region" label="Faritra (Région)" error={errors.region?.message} required>
                  <Input
                    id="region"
                    placeholder="Analamanga"
                    {...register('region')}
                    className={errors.region ? 'border-destructive' : ''}
                  />
                </FormField>
              </div>
            </CardContent>
          </Card>

          {/* Informations de transfert */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de Transfert</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField id="purchaseCommune" label="Commune du lieu d'achat" error={errors.purchaseCommune?.message} required>
                <Input
                  id="purchaseCommune"
                  placeholder="Antananarivo"
                  {...register('purchaseCommune')}
                  className={errors.purchaseCommune ? 'border-destructive' : ''}
                />
              </FormField>
            </CardContent>
          </Card>

          {/* Informations de vérification */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informations de Vérification</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField id="verificationDate" label="Date de vérification" error={errors.verificationDate?.message} required>
                <Input
                  id="verificationDate"
                  type="date"
                  {...register('verificationDate')}
                  className={errors.verificationDate ? 'border-destructive' : ''}
                />
              </FormField>
              <FormField id="arreteDate" label="Date de l'arrêté" error={errors.arreteDate?.message} required>
                <Input
                  id="arreteDate"
                  type="date"
                  {...register('arreteDate')}
                  className={errors.arreteDate ? 'border-destructive' : ''}
                />
              </FormField>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Footer fixe */}
      <div className="border-t px-6 py-4 flex justify-end gap-2 shrink-0">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isGenerating}>
          Annuler
        </Button>
        <Button type="submit" disabled={isGenerating || cattleIds.length === 0}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Création...
            </>
          ) : (
            `Créer le brouillon${cattleIds.length > 0 ? ` (${cattleIds.length} bœuf${cattleIds.length > 1 ? 's' : ''})` : ''}`
          )}
        </Button>
      </div>
    </form>
  );
});

// ─── Composant principal ──────────────────────────────────────────────────────

export function PassportGeneratorModal({
  open,
  onOpenChange,
  onGenerate,
  isGenerating,
}: PassportGeneratorModalProps) {
  const { selectedHerdBookId } = useHerdBookSelection();

  // Callbacks stables : ne changent pas de référence entre les renders,
  // ce qui empêche PassportFormContent (mémoïsé) de se re-rendre inutilement.
  const handleCancel = useCallback(() => onOpenChange(false), [onOpenChange]);
  const handleGenerate = useCallback(
    (data: CreatePassportDto) => onGenerate(data),
    [onGenerate]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4 shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Nouveau Brouillon de Passeport Bovin
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations requises. Le PDF sera généré depuis la liste des passeports.
          </DialogDescription>
        </DialogHeader>

        {/* Monté/démonté avec open pour réinitialiser l'état du formulaire */}
        {open && (
          <PassportFormContent
            onGenerate={handleGenerate}
            isGenerating={isGenerating}
            onCancel={handleCancel}
            herdBookId={selectedHerdBookId ?? ''}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
