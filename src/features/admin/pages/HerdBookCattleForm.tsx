import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CattlePhotosInput, CattlePhotoInputValue } from "@/features/cattle/components/CattlePhotosInput";
import { CreateHerdBookCattleData, UpdateHerdBookCattleData, CattleData } from "@/features/admin/services/herdBookCattleService";

interface HerdBookCattleFormProps {
  mode: 'create' | 'edit';
  formData: CreateHerdBookCattleData | UpdateHerdBookCattleData;
  setFormData: (data: CreateHerdBookCattleData | UpdateHerdBookCattleData) => void;
  herdBooks: { id: string; reference?: string; name?: string; year?: number }[];
  categories: { id: string; name: string }[];
  statuses: { id: string; name: string }[];
  unregisteredCattle: { id: string; name: string }[];
  cattleIdDisabled?: boolean;
  // Props pour mode create avec nouveau bovin
  cattleSourceType?: 'existing' | 'new';
  setCattleSourceType?: (type: 'existing' | 'new') => void;
  newCattleData?: CattleData;
  setNewCattleData?: (data: CattleData) => void;
  newCattlePhotos?: CattlePhotoInputValue[];
  setNewCattlePhotos?: (photos: CattlePhotoInputValue[]) => void;
  hasExistingCattleOptions?: boolean;
  // Callbacks
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isPending: boolean;
}

const HerdBookCattleForm = ({
  mode,
  formData,
  setFormData,
  herdBooks,
  categories,
  statuses,
  unregisteredCattle,
  cattleIdDisabled = false,
  cattleSourceType = 'existing',
  setCattleSourceType,
  newCattleData,
  setNewCattleData,
  newCattlePhotos = [],
  setNewCattlePhotos,
  hasExistingCattleOptions = false,
  onSubmit,
  onCancel,
  isPending,
}: HerdBookCattleFormProps) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Herd Book Selection */}
      <div>
        <Label htmlFor="herdBook">Livre de troupeau *</Label>
        <Select 
          value={formData.herdBookId} 
          onValueChange={(value) => setFormData({ ...formData, herdBookId: value })}
          disabled={isPending}
        >
          <SelectTrigger id="herdBook">
            <SelectValue placeholder="Sélectionner un livre de troupeau" />
          </SelectTrigger>
          <SelectContent>
            {herdBooks.map((hb) => (
              <SelectItem key={hb.id} value={hb.id}>
                {hb.reference} {hb.year ? `(${hb.year})` : ''}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Cattle Source Selection (Create mode only) */}
      {mode === 'create' && setCattleSourceType && (
        <div>
          <Label>Source du bovin</Label>
          <div className="flex gap-4 mt-2">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="cattleSource"
                value="existing"
                checked={cattleSourceType === 'existing'}
                onChange={(e) => setCattleSourceType(e.target.value as 'existing' | 'new')}
                disabled={!hasExistingCattleOptions || isPending}
              />
              <span>Bovin existant</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="cattleSource"
                value="new"
                checked={cattleSourceType === 'new'}
                onChange={(e) => setCattleSourceType(e.target.value as 'existing' | 'new')}
                disabled={isPending}
              />
              <span>Nouveau bovin</span>
            </label>
          </div>
        </div>
      )}

      {/* Existing Cattle Selection */}
      {mode === 'create' && cattleSourceType === 'existing' && (
        <div>
          <Label htmlFor="cattleId">Bovin *</Label>
          <Select 
            value={formData.cattleId} 
            onValueChange={(value) => setFormData({ ...formData, cattleId: value })}
            disabled={isPending}
          >
            <SelectTrigger id="cattleId">
              <SelectValue placeholder="Sélectionner un bovin" />
            </SelectTrigger>
            <SelectContent>
              {unregisteredCattle.map((cattle) => (
                <SelectItem key={cattle.id} value={cattle.id}>
                  {cattle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Edit mode - Cattle display (disabled) */}
      {mode === 'edit' && (
        <div>
          <Label htmlFor="cattleId">Bovin *</Label>
          <Select 
            value={formData.cattleId} 
            onValueChange={(value) => setFormData({ ...formData, cattleId: value })}
            disabled={cattleIdDisabled || isPending}
          >
            <SelectTrigger id="cattleId">
              <SelectValue placeholder="Bovin associé" />
            </SelectTrigger>
            <SelectContent>
              {unregisteredCattle.map((cattle) => (
                <SelectItem key={cattle.id} value={cattle.id}>
                  {cattle.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* New Cattle Form (Create mode only) */}
      {mode === 'create' && cattleSourceType === 'new' && newCattleData && setNewCattleData && (
        <div className="space-y-4 p-4 border rounded-lg">
          <h3 className="font-semibold">Informations du nouveau bovin</h3>
          
          <div>
            <Label htmlFor="cattleName">Nom *</Label>
            <Input
              id="cattleName"
              value={newCattleData.name}
              onChange={(e) => setNewCattleData({ ...newCattleData, name: e.target.value })}
              disabled={isPending}
              placeholder="Nom du bovin"
            />
          </div>

          <div>
            <Label htmlFor="cattleGender">Sexe *</Label>
            <Select 
              value={newCattleData.gender} 
              onValueChange={(value) => setNewCattleData({ ...newCattleData, gender: value })}
              disabled={isPending}
            >
              <SelectTrigger id="cattleGender">
                <SelectValue placeholder="Sélectionner le sexe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Mâle</SelectItem>
                <SelectItem value="FEMALE">Femelle</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cattleBirthDate">Date de naissance *</Label>
            <Input
              id="cattleBirthDate"
              type="date"
              value={newCattleData.birthDate}
              onChange={(e) => setNewCattleData({ ...newCattleData, birthDate: e.target.value })}
              disabled={isPending}
            />
          </div>

          <div>
            <Label htmlFor="cattleCharacter">Caractère</Label>
            <Input
              id="cattleCharacter"
              value={newCattleData.character}
              onChange={(e) => setNewCattleData({ ...newCattleData, character: e.target.value })}
              disabled={isPending}
              placeholder="Caractère du bovin"
            />
          </div>

          <div>
            <Label htmlFor="cattleBrand">Marque</Label>
            <Input
              id="cattleBrand"
              value={newCattleData.brand}
              onChange={(e) => setNewCattleData({ ...newCattleData, brand: e.target.value })}
              disabled={isPending}
              placeholder="Marque du bovin"
            />
          </div>

          <div>
            <Label htmlFor="cattleDistinctiveSign">Signe distinctif</Label>
            <Input
              id="cattleDistinctiveSign"
              value={newCattleData.distinctiveSign}
              onChange={(e) => setNewCattleData({ ...newCattleData, distinctiveSign: e.target.value })}
              disabled={isPending}
              placeholder="Signe distinctif"
            />
          </div>

          <div>
            <Label>Photos</Label>
            <CattlePhotosInput
              value={newCattlePhotos}
              onChange={setNewCattlePhotos}
              disabled={isPending}
            />
          </div>
        </div>
      )}

      {/* Category Selection */}
      <div>
        <Label htmlFor="category">Catégorie *</Label>
        <Select 
          value={formData.categoryId} 
          onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
          disabled={isPending}
        >
          <SelectTrigger id="category">
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Status Selection */}
      <div>
        <Label htmlFor="status">Statut *</Label>
        <Select 
          value={formData.statusId} 
          onValueChange={(value) => setFormData({ ...formData, statusId: value })}
          disabled={isPending}
        >
          <SelectTrigger id="status">
            <SelectValue placeholder="Sélectionner un statut" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((stat) => (
              <SelectItem key={stat.id} value={stat.id}>
                {stat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* N° Carnet */}
      <div>
        <Label htmlFor="nCarnet">N° Carnet</Label>
        <Input
          id="nCarnet"
          value={formData.nCarnet}
          onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })}
          disabled={isPending}
          placeholder="Numéro de carnet"
        />
      </div>

      <div className="flex gap-4 justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
          Annuler
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : mode === 'create' ? "Créer" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
};

export default HerdBookCattleForm;
