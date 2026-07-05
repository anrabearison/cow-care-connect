import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable, Column } from "@/components/admin/DataTable";
import { FormDialog } from "@/components/admin/FormDialog";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { herdBookCattleService, HerdBookCattle, CreateHerdBookCattleData, UpdateHerdBookCattleData, CattleData, CattleSourceData } from "@/features/admin/services/herdBookCattleService";
import { cattleService } from "@/features/cattle/services";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { referenceService } from "@/features/common/services/referenceService";

const HerdBookCattleListPage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [selectedItem, setSelectedItem] = useState<HerdBookCattle | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // New state for reference data
  const [herdBooks, setHerdBooks] = useState<{ id: string; reference?: string; name?: string; year?: number }[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [statuses, setStatuses] = useState<{ id: string; name: string }[]>([]);
  const [unregisteredCattle, setUnregisteredCattle] = useState<{ id: string; name: string }[]>([]);
  const [cattleSourceType, setCattleSourceType] = useState<'existing' | 'new'>('existing');
  const hasExistingCattleOptions = unregisteredCattle.length > 0;
  
  const [formData, setFormData] = useState<CreateHerdBookCattleData>({ 
    herdBookId: "", 
    cattleId: "", 
    nCarnet: "", 
    categoryId: "", 
    statusId: "" 
  });
  
  const [newCattleData, setNewCattleData] = useState<CattleData>({
    name: '',
    nickname: '',
    gender: '',
    birthDate: '',
    character: '',
    brand: '',
    distinctiveSign: '',
    photo: '',
    source: { type: 'ACHETE' },
  });

  const { data: data, isLoading } = useQuery({
    queryKey: ["admin-herd-book-cattle", page, search],
    queryFn: () =>
      herdBookCattleService.getHerdBookCattleList({
        page,
        per_page: pageSize,
        q: search || undefined,
      }),
  });

  // Load reference data
  useEffect(() => {
    const loadReferenceData = async () => {
      try {
        // Load herd books
        const hbResponse = await referenceService.getHerdBooks();
        if (hbResponse.success) {
          const sorted = (hbResponse.data || [])
            .map((item: any) => ({
              id: item.id,
              reference: item.reference || item.name || '',
              name: item.name || item.reference || '',
              year: item.year,
            }))
            .sort((a, b) => (b.year || 0) - (a.year || 0));
          setHerdBooks(sorted);
        }

        // Load categories
        const catResponse = await referenceService.getCategories();
        if (catResponse.success) {
          setCategories(catResponse.data);
        }

        // Load statuses
        const statResponse = await referenceService.getStatuses();
        if (statResponse.success) {
          setStatuses(statResponse.data);
        }
      } catch (error) {
        console.error('Error loading reference data:', error);
      }
    };

    loadReferenceData();
  }, []);

  // Load unregistered cattle when herdBookId or dialog changes
  useEffect(() => {
    const loadUnregisteredCattle = async () => {
      if (!formData.herdBookId) {
        setUnregisteredCattle([]);
        return;
      }
      try {
        const response = await cattleService.getCattleList({
          excludedHerdBookId: formData.herdBookId,
          page: 1,
          per_page: 50,
        });

        if (response.success && response.data) {
          const options = (response.data as any[]).map(c => ({
            id: c.id,
            name: c.name || 'Bovin sans nom',
          }));
          setUnregisteredCattle(options);

          if (options.length === 0) {
            setCattleSourceType('new');
          }
        }
      } catch (error) {
        console.error('Error loading unregistered cattle:', error);
        setUnregisteredCattle([]);
      }
    };

    if (isCreateDialogOpen || isEditDialogOpen) {
      loadUnregisteredCattle();
    }
  }, [formData.herdBookId, isCreateDialogOpen, isEditDialogOpen]);

  const createMutation = useMutation({
    mutationFn: (data: CreateHerdBookCattleData) => herdBookCattleService.createHerdBookCattle(data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription créée avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsCreateDialogOpen(false);
      setFormData({ herdBookId: "", cattleId: "", nCarnet: "", categoryId: "", statusId: "" });
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la création", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateHerdBookCattleData }) =>
      herdBookCattleService.updateHerdBookCattle(id, data),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription mise à jour avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsEditDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la mise à jour", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => herdBookCattleService.deleteHerdBookCattle(id),
    onSuccess: () => {
      toast({ title: "Succès", description: "Inscription supprimée avec succès" });
      queryClient.invalidateQueries({ queryKey: ["admin-herd-book-cattle"] });
      setIsDeleteDialogOpen(false);
      setSelectedItem(null);
    },
    onError: () => {
      toast({ title: "Erreur", description: "Erreur lors de la suppression", variant: "destructive" });
    },
  });

  const handleCreate = () => {
    // Validation
    if (!formData.herdBookId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un livre de troupeau", variant: "destructive" });
      return;
    }

    if (!formData.categoryId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner une catégorie", variant: "destructive" });
      return;
    }

    if (!formData.statusId) {
      toast({ title: "Erreur", description: "Veuillez sélectionner un statut", variant: "destructive" });
      return;
    }

    const submitData: CreateHerdBookCattleData = { ...formData };

    if (cattleSourceType === 'new') {
      // Validate new cattle fields
      if (!newCattleData.name) {
        toast({ title: "Erreur", description: "Veuillez entrer le nom du bovin", variant: "destructive" });
        return;
      }
      if (!newCattleData.gender) {
        toast({ title: "Erreur", description: "Veuillez sélectionner le sexe du bovin", variant: "destructive" });
        return;
      }
      if (!newCattleData.birthDate) {
        toast({ title: "Erreur", description: "Veuillez entrer la date de naissance", variant: "destructive" });
        return;
      }
      submitData.cattle = newCattleData;
      submitData.cattleId = undefined;
    } else {
      // Existing cattle validation
      if (!formData.cattleId) {
        toast({ title: "Erreur", description: "Veuillez sélectionner un bovin", variant: "destructive" });
        return;
      }
    }

    console.log('Submitting:', submitData);
    createMutation.mutate(submitData);
  };

  const handleUpdate = () => {
    if (selectedItem) {
      updateMutation.mutate({ id: selectedItem.id, data: formData });
    }
  };

  const openEditDialog = (item: HerdBookCattle) => {
    setSelectedItem(item);
    setFormData({ herdBookId: item.herdBookId, cattleId: item.cattleId || "", nCarnet: item.nCarnet || "", categoryId: item.categoryId, statusId: item.statusId });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    setSelectedItem(null);
    // Set defaults: most recent herd book and "En bonne santé" status
    const mostRecentHerdBook = herdBooks[0]; // Already sorted by year DESC
    const defaultHerdBook = mostRecentHerdBook?.id || "";
    
    // Find "En bonne santé" status (case-insensitive partial match)
    const defaultStatus = statuses.find(s => 
      s.name?.toLowerCase().includes('bonne santé')
    ) || statuses[0];
    
    const statusId = defaultStatus?.id || "";
    
    setFormData({ herdBookId: defaultHerdBook, cattleId: "", nCarnet: "", categoryId: "", statusId });
    setCattleSourceType(hasExistingCattleOptions ? 'existing' : 'new');
    setNewCattleData({
      name: '',
      nickname: '',
      gender: '',
      birthDate: '',
      character: '',
      brand: '',
      distinctiveSign: '',
      photo: '',
      source: { type: 'ACHETE' },
    });
    setIsCreateDialogOpen(true);
  };

  const columns: Column<HerdBookCattle>[] = [
    { key: "id", header: "ID", render: (item) => <span className="font-mono text-sm">{item.id.slice(0, 8)}...</span> },
    { key: "herdBook", header: "Livre de troupeau", render: (item) => {
      if (!item.herdBook) return "-";
      if (typeof item.herdBook === 'string') return item.herdBook;
      if (item.herdBook.name) return String(item.herdBook.name);
      return "-";
    }},
    { key: "cattle", header: "Bovin", render: (item) => {
      if (!item.cattle) return "-";
      if (typeof item.cattle === 'string') return item.cattle;
      if (item.cattle.name) return String(item.cattle.name);
      return "-";
    }},
    { key: "category", header: "Catégorie", render: (item) => {
      if (!item.category) return "-";
      if (typeof item.category === 'string') return item.category;
      if (item.category.name) return String(item.category.name);
      return "-";
    }},
    { key: "status", header: "Statut", render: (item) => {
      if (!item.status) return "-";
      if (typeof item.status === 'string') return item.status;
      if (item.status.name) return String(item.status.name);
      return "-";
    }},
    { key: "nCarnet", header: "N° Carnet", render: (item) => item.nCarnet || "-" },
  ];

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Inscriptions bovins</h1>
          <p className="text-muted-foreground mt-2">Gestion des inscriptions bovins</p>
        </div>
      </div>

      <DataTable
        data={data?.data || []}
        columns={columns}
        loading={isLoading}
        onEdit={openEditDialog}
        onView={(item) => { setSelectedItem(item); setIsViewDialogOpen(true); }}
        onDelete={(item) => { setSelectedItem(item); setIsDeleteDialogOpen(true); }}
        onAdd={openCreateDialog}
        canEdit canDelete canView canAdd
        pagination={{ page, pageSize, total: data?.total || 0, onPageChange: setPage }}
        search={{ value: search, onChange: setSearch }}
      />

      <FormDialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen} title="Détails de l'inscription" submitText="Fermer" cancelText="" onSubmit={() => setIsViewDialogOpen(false)}>
        {selectedItem && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><Label>Livre de troupeau</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.herdBook) return "-";
                if (typeof selectedItem.herdBook === 'string') return selectedItem.herdBook;
                if (selectedItem.herdBook.name) return selectedItem.herdBook.name;
                return "-";
              })()}</p></div>
              <div><Label>Bovin</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.cattle) return "-";
                if (typeof selectedItem.cattle === 'string') return selectedItem.cattle;
                if (selectedItem.cattle.name) return selectedItem.cattle.name;
                return "-";
              })()}</p></div>
              <div><Label>N° Carnet</Label><p className="text-sm font-medium">{selectedItem.nCarnet || "-"}</p></div>
              <div><Label>Catégorie</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.category) return "-";
                if (typeof selectedItem.category === 'string') return selectedItem.category;
                if (selectedItem.category.name) return selectedItem.category.name;
                return "-";
              })()}</p></div>
              <div><Label>Statut</Label><p className="text-sm font-medium">{(() => {
                if (!selectedItem.status) return "-";
                if (typeof selectedItem.status === 'string') return selectedItem.status;
                if (selectedItem.status.name) return selectedItem.status.name;
                return "-";
              })()}</p></div>
            </div>
          </div>
        )}
      </FormDialog>

      <FormDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} title="Créer une inscription bovine" submitText="Créer" cancelText="Annuler" onSubmit={handleCreate} loading={createMutation.isPending}>
        <div className="space-y-6">
          {/* Herd Book Selection */}
          <div>
            <Label htmlFor="herdBook">Livre de troupeau *</Label>
            <Select value={formData.herdBookId} onValueChange={(value) => setFormData({ ...formData, herdBookId: value })}>
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

          {/* Cattle Source Type Selection */}
          <div>
            <Label>Source du bovin</Label>
            <div className="flex gap-4 mt-2">
              <label className={`flex items-center gap-2 ${!hasExistingCattleOptions ? 'opacity-50' : ''}`}>
                <input
                  type="radio"
                  checked={cattleSourceType === 'existing'}
                  onChange={() => setCattleSourceType('existing')}
                  disabled={!hasExistingCattleOptions}
                  className="w-4 h-4"
                />
                <span className="text-sm">Bovin existant</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  checked={cattleSourceType === 'new'}
                  onChange={() => setCattleSourceType('new')}
                  className="w-4 h-4"
                />
                <span className="text-sm">Nouveau bovin</span>
              </label>
            </div>
          </div>

          {!hasExistingCattleOptions && (
            <p className="text-sm text-muted-foreground">
              Aucun bovin non inscrit n’est disponible pour ce livre de troupeau. Le formulaire utilisera automatiquement le mode « Nouveau bovin ».
            </p>
          )}

          {/* Existing Cattle Selection */}
          {cattleSourceType === 'existing' && (
            <div>
              <Label htmlFor="cattleId">Sélectionner un bovin *</Label>
              <Select value={formData.cattleId} onValueChange={(value) => setFormData({ ...formData, cattleId: value })}>
                <SelectTrigger id="cattleId">
                  <SelectValue placeholder="Sélectionner un bovin non inscrit" />
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

          {/* New Cattle Embedded Form */}
          {cattleSourceType === 'new' && (
            <div className="border p-4 rounded-md bg-muted/20 space-y-4">
              <h4 className="font-medium">Informations du nouveau bovin</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cattleName">Nom *</Label>
                  <Input
                    id="cattleName"
                    value={newCattleData.name}
                    onChange={(e) => setNewCattleData({ ...newCattleData, name: e.target.value })}
                    placeholder="Nom du bovin"
                  />
                </div>
                <div>
                  <Label htmlFor="cattleNickname">Surnom</Label>
                  <Input
                    id="cattleNickname"
                    value={newCattleData.nickname}
                    onChange={(e) => setNewCattleData({ ...newCattleData, nickname: e.target.value })}
                    placeholder="Surnom"
                  />
                </div>
                <div>
                  <Label htmlFor="cattleGender">Sexe *</Label>
                  <Select value={newCattleData.gender} onValueChange={(value) => setNewCattleData({ ...newCattleData, gender: value })}>
                    <SelectTrigger id="cattleGender">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="M">Mâle</SelectItem>
                      <SelectItem value="F">Femelle</SelectItem>
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
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category Selection */}
          <div>
            <Label htmlFor="category">Catégorie *</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
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
            <Select value={formData.statusId} onValueChange={(value) => setFormData({ ...formData, statusId: value })}>
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
              placeholder="Numéro de carnet"
            />
          </div>
        </div>
      </FormDialog>

      <FormDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} title="Modifier l'inscription" submitText="Enregistrer" cancelText="Annuler" onSubmit={handleUpdate} loading={updateMutation.isPending}>
        <div className="space-y-4">
          <div>
            <Label htmlFor="editHerdBook">Livre de troupeau *</Label>
            <Select value={formData.herdBookId} onValueChange={(value) => setFormData({ ...formData, herdBookId: value })}>
              <SelectTrigger id="editHerdBook">
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
          <div>
            <Label htmlFor="editCattleId">Bovin *</Label>
            <Select value={formData.cattleId} onValueChange={(value) => setFormData({ ...formData, cattleId: value })}>
              <SelectTrigger id="editCattleId">
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
          <div>
            <Label htmlFor="editCategory">Catégorie *</Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData({ ...formData, categoryId: value })}>
              <SelectTrigger id="editCategory">
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
          <div>
            <Label htmlFor="editStatus">Statut *</Label>
            <Select value={formData.statusId} onValueChange={(value) => setFormData({ ...formData, statusId: value })}>
              <SelectTrigger id="editStatus">
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
          <div>
            <Label htmlFor="editNCarnet">N° Carnet</Label>
            <Input
              id="editNCarnet"
              value={formData.nCarnet}
              onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })}
              placeholder="Numéro de carnet"
            />
          </div>
        </div>
      </FormDialog>

      <ConfirmDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen} title="Supprimer l'inscription" description={`Êtes-vous sûr de vouloir supprimer cette inscription ?`} onConfirm={() => deleteMutation.mutate(selectedItem!.id)} confirmText="Supprimer" cancelText="Annuler" variant="destructive" loading={deleteMutation.isPending} />
    </div>
  );
};

export default HerdBookCattleListPage;
