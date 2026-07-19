import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft } from 'lucide-react';

interface FormState {
  name: string;
  nickname: string;
  gender: 'M' | 'F' | '';
  birthDate: string;
  characterId: string;
  brand: string;
  distinctiveSign: string;
  nCarnet: string;
  sourceType: 'ACHETE' | 'NE_DANS_TROUPEAU';
  motherId: string;
  fatherId: string;
  purchaseSupplier: string;
  purchaseDate: string;
  purchasePrice: string;
  purchaseWeight: string;
  purchaseHealthStatus: string;
  purchaseNotes: string;
}

interface CattleFormProps {
  mode: 'create' | 'edit';
  formData: FormState;
  setFormData: (data: FormState) => void;
  characters: Array<{ id: string; name: string }>;
  isPending?: boolean;
  isSubmitting?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  errors?: Record<string, string>;
  submitLabel?: string;
}

const CattleForm = ({
  mode,
  formData,
  setFormData,
  characters,
  isPending = false,
  onSubmit,
  onCancel,
  errors = {},
  submitLabel = mode === 'create' ? 'Créer' : 'Enregistrer',
}: CattleFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6 rounded-lg border bg-background p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} aria-label="Annuler">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{mode === 'create' ? 'Nouveau bovin' : 'Modifier le bovin'}</h1>
          <p className="text-muted-foreground mt-2">
            {mode === 'create'
              ? 'Créer un bovin et l’inscrire dans le livre de troupeau sélectionné'
              : 'Modifier les informations du bovin'}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="grid gap-2">
          <Label htmlFor="name">Nom *</Label>
          <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={errors.name ? 'border-red-500' : ''} />
          {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="nickname">Surnom</Label>
          <Input id="nickname" value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="gender">Sexe *</Label>
          <Select value={formData.gender} onValueChange={(value) => setFormData({ ...formData, gender: value as 'M' | 'F' })}>
            <SelectTrigger id="gender" className={errors.gender ? 'border-red-500' : ''}>
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="M">Mâle</SelectItem>
              <SelectItem value="F">Femelle</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-500">{errors.gender}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="birthDate">Date de naissance *</Label>
          <Input id="birthDate" type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} className={errors.birthDate ? 'border-red-500' : ''} />
          {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="character">Caractère</Label>
          <Select value={formData.characterId} onValueChange={(value) => setFormData({ ...formData, characterId: value })}>
            <SelectTrigger id="character">
              <SelectValue placeholder="Sélectionner" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((char) => (
                <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="brand">Marque</Label>
          <Input id="brand" value={formData.brand} onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="distinctiveSign">Signe distinctif</Label>
          <Input id="distinctiveSign" value={formData.distinctiveSign} onChange={(e) => setFormData({ ...formData, distinctiveSign: e.target.value })} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="nCarnet">N° Carnet</Label>
          <Input id="nCarnet" value={formData.nCarnet} onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })} />
        </div>
      </div>

      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="font-semibold">Origine</h2>
        <div className="grid gap-2">
          <Label htmlFor="sourceType">Type d’origine</Label>
          <Select value={formData.sourceType} onValueChange={(value) => setFormData({ ...formData, sourceType: value as 'ACHETE' | 'NE_DANS_TROUPEAU' })}>
            <SelectTrigger id="sourceType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACHETE">Acheté</SelectItem>
              <SelectItem value="NE_DANS_TROUPEAU">Né dans le troupeau</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.sourceType === 'ACHETE' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="purchaseSupplier">Fournisseur</Label>
              <Input id="purchaseSupplier" value={formData.purchaseSupplier} onChange={(e) => setFormData({ ...formData, purchaseSupplier: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseDate">Date d’achat</Label>
              <Input id="purchaseDate" type="date" value={formData.purchaseDate} onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchasePrice">Prix d’achat (MGA)</Label>
              <Input id="purchasePrice" type="number" value={formData.purchasePrice} onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purchaseWeight">Poids à l’achat (kg)</Label>
              <Input id="purchaseWeight" type="number" value={formData.purchaseWeight} onChange={(e) => setFormData({ ...formData, purchaseWeight: e.target.value })} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="purchaseHealthStatus">État de santé à l’achat</Label>
              <Input id="purchaseHealthStatus" value={formData.purchaseHealthStatus} onChange={(e) => setFormData({ ...formData, purchaseHealthStatus: e.target.value })} />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="purchaseNotes">Notes</Label>
              <Textarea id="purchaseNotes" value={formData.purchaseNotes} onChange={(e) => setFormData({ ...formData, purchaseNotes: e.target.value })} rows={3} />
            </div>
          </div>
        )}

        {formData.sourceType === 'NE_DANS_TROUPEAU' && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="motherId">ID de la mère</Label>
              <Input id="motherId" value={formData.motherId} onChange={(e) => setFormData({ ...formData, motherId: e.target.value })} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fatherId">ID du père</Label>
              <Input id="fatherId" value={formData.fatherId} onChange={(e) => setFormData({ ...formData, fatherId: e.target.value })} />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
        <Button type="submit" disabled={isPending}>{submitLabel}</Button>
      </div>
    </form>
  );
};

export default CattleForm;
export type { FormState as CattleFormState };
