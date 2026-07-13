import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cattle } from '@/features/cattle/types';
import { cattleService } from '@/features/cattle/services';
import { useToast } from '@/hooks/use-toast';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';

interface AddCattleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>, nCarnet?: string) => void;
}

export const AddCattleModal: React.FC<AddCattleModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { toast } = useToast();
    const { selectedHerdBook } = useHerdBookSelection();
    const [characters, setCharacters] = useState<{ id: string, name: string }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: '' as 'M' | 'F' | '',
        birthDate: '',
        character: 1,
        brand: '',
        distinctiveSign: '',
        nCarnet: '',
        sourceType: 'ACHETE' as 'ACHETE' | 'NE_DANS_TROUPEAU',
        motherId: '',
        fatherId: '',
        purchaseSupplier: '',
        purchaseDate: '',
        purchasePrice: '',
        purchaseWeight: '',
        purchaseHealthStatus: '',
        purchaseNotes: ''
    });

    useEffect(() => {
        const fetchCharacters = async () => {
            const response = await cattleService.getCharacters();
            if (response.success) {
                setCharacters(response.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les caractères"
                });
            }
        };

        if (open) {
            fetchCharacters();
        }
    }, [open, toast]);

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = "Le nom est obligatoire";
        if (!formData.gender) newErrors.gender = "Le sexe est obligatoire";
        if (!formData.birthDate) newErrors.birthDate = "La date de naissance est obligatoire";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
            name: formData.name,
            nickname: formData.nickname || undefined,
            gender: formData.gender as 'M' | 'F',
            birthDate: formData.birthDate,
            character: {
                id: formData.character.toString(),
                name: characters.find(c => c.id === formData.character.toString())?.name || 'Docile'
            },
            brand: formData.brand || undefined,
            distinctiveSign: formData.distinctiveSign || undefined,
            photo: undefined,
            // status removed as not supported by backend on create
            motherId: formData.sourceType === 'NE_DANS_TROUPEAU' && formData.motherId ? formData.motherId : undefined,
            fatherId: formData.sourceType === 'NE_DANS_TROUPEAU' && formData.fatherId ? formData.fatherId : undefined,
            source: {
                type: formData.sourceType,
                supplier: formData.sourceType === 'ACHETE' ? formData.purchaseSupplier : undefined,
                purchaseDate: formData.sourceType === 'ACHETE' && formData.purchaseDate ? formData.purchaseDate : undefined,
                purchasePrice: formData.sourceType === 'ACHETE' && formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
                purchaseWeight: formData.sourceType === 'ACHETE' && formData.purchaseWeight ? parseFloat(formData.purchaseWeight) : undefined,
                purchaseHealthStatus: formData.sourceType === 'ACHETE' ? formData.purchaseHealthStatus : undefined,
                purchaseNotes: formData.sourceType === 'ACHETE' ? formData.purchaseNotes : undefined,
            }
        };

        onAdd(cattleData, formData.nCarnet || undefined);
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            nickname: '',
            gender: '',
            birthDate: '',
            character: 1,
            brand: '',
            distinctiveSign: '',
            nCarnet: '',
            sourceType: 'ACHETE',
            motherId: '',
            fatherId: '',
            purchaseSupplier: '',
            purchaseDate: '',
            purchasePrice: '',
            purchaseWeight: '',
            purchaseHealthStatus: '',
            purchaseNotes: ''
        });
        setErrors({});
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Ajouter un nouvel animal</DialogTitle>
                    <DialogDescription>
                        Remplissez les informations ci-dessous pour ajouter un nouvel animal au troupeau.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-6 py-4">
                        {/* Informations Générales */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations Générales</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nom *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => {
                                            setFormData({ ...formData, name: e.target.value });
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                        className={errors.name ? 'border-red-500' : ''}
                                    />
                                    {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nickname">Surnom</Label>
                                    <Input
                                        id="nickname"
                                        value={formData.nickname}
                                        onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="gender">Sexe *</Label>
                                    <Select
                                        value={formData.gender}
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, gender: value as 'M' | 'F' });
                                            if (errors.gender) setErrors({ ...errors, gender: '' });
                                        }}
                                    >
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
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => {
                                            setFormData({ ...formData, birthDate: e.target.value });
                                            if (errors.birthDate) setErrors({ ...errors, birthDate: '' });
                                        }}
                                        className={errors.birthDate ? 'border-red-500' : ''}
                                    />
                                    {errors.birthDate && <p className="text-sm text-red-500">{errors.birthDate}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="character">Caractère</Label>
                                    <Select
                                        value={formData.character.toString()}
                                        onValueChange={(value) => setFormData({ ...formData, character: parseInt(value) })}
                                    >
                                        <SelectTrigger id="character">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {characters.map((char) => (
                                                <SelectItem key={char.id} value={char.id.toString()}>
                                                    {char.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="brand">Marque</Label>
                                    <Input
                                        id="brand"
                                        value={formData.brand}
                                        onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="nCarnet">N° Carnet</Label>
                                    <Input
                                        id="nCarnet"
                                        value={formData.nCarnet}
                                        onChange={(e) => setFormData({ ...formData, nCarnet: e.target.value })}
                                        placeholder="Numéro de carnet pour le livre de troupeau"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Origine */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Origine</h3>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="sourceType">Type d'origine</Label>
                                    <Select
                                        value={formData.sourceType}
                                        onValueChange={(value) => setFormData({ ...formData, sourceType: value as 'ACHETE' | 'NE_DANS_TROUPEAU' })}
                                    >
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseSupplier">Fournisseur</Label>
                                            <Input
                                                id="purchaseSupplier"
                                                value={formData.purchaseSupplier}
                                                onChange={(e) => setFormData({ ...formData, purchaseSupplier: e.target.value })}
                                                placeholder="Nom du fournisseur"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseDate">Date d'achat</Label>
                                            <Input
                                                id="purchaseDate"
                                                type="date"
                                                value={formData.purchaseDate}
                                                onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchasePrice">Prix d'achat (MGA)</Label>
                                            <Input
                                                id="purchasePrice"
                                                type="number"
                                                value={formData.purchasePrice}
                                                onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                                placeholder="Ex: 500000"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="purchaseWeight">Poids à l'achat (kg)</Label>
                                            <Input
                                                id="purchaseWeight"
                                                type="number"
                                                value={formData.purchaseWeight}
                                                onChange={(e) => setFormData({ ...formData, purchaseWeight: e.target.value })}
                                                placeholder="Ex: 250"
                                            />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="purchaseHealthStatus">État de santé à l'achat</Label>
                                            <Input
                                                id="purchaseHealthStatus"
                                                value={formData.purchaseHealthStatus}
                                                onChange={(e) => setFormData({ ...formData, purchaseHealthStatus: e.target.value })}
                                                placeholder="Ex: En bonne santé"
                                            />
                                        </div>
                                        <div className="grid gap-2 md:col-span-2">
                                            <Label htmlFor="purchaseNotes">Notes d'achat</Label>
                                            <Textarea
                                                id="purchaseNotes"
                                                value={formData.purchaseNotes}
                                                onChange={(e) => setFormData({ ...formData, purchaseNotes: e.target.value })}
                                                placeholder="Notes supplémentaires sur l'achat"
                                                rows={3}
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.sourceType === 'NE_DANS_TROUPEAU' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="grid gap-2">
                                            <Label htmlFor="motherId">ID de la mère</Label>
                                            <Input
                                                id="motherId"
                                                value={formData.motherId}
                                                onChange={(e) => setFormData({ ...formData, motherId: e.target.value })}
                                                placeholder="UUID du bovin mère"
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="fatherId">ID du père</Label>
                                            <Input
                                                id="fatherId"
                                                value={formData.fatherId}
                                                onChange={(e) => setFormData({ ...formData, fatherId: e.target.value })}
                                                placeholder="UUID du bovin père (Optionnel)"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Ajouter</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
