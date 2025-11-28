import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cattle } from '@/features/cattle/types';
import { referenceService } from '@/features/common/services/referenceService';
import { useToast } from '@/hooks/use-toast';

interface AddPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>) => void;
}

export const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [characters, setCharacters] = useState<{ id: string, name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: '' as 'M' | 'F' | '',
        birthDate: '',
        character: 'none',
        category: '',
        brand: '',
        distinctiveSign: '',
        // Purchase fields
        supplier: '',
        purchaseDate: '',
        purchasePrice: '',
        purchaseWeight: '',
        purchaseHealthStatus: '',
        purchaseNotes: ''
    });

    useEffect(() => {
        const fetchReferenceData = async () => {
            const [categoriesResponse, charactersResponse] = await Promise.all([
                referenceService.getCategories(),
                referenceService.getCharacters()
            ]);

            if (categoriesResponse.success) {
                setCategories(categoriesResponse.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les catégories"
                });
            }

            if (charactersResponse.success) {
                setCharacters(charactersResponse.data);
                // Set default character to first one if available
                if (charactersResponse.data.length > 0 && !formData.character) {
                    setFormData(prev => ({ ...prev, character: charactersResponse.data[0].id }));
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les caractères"
                });
            }
        };

        if (open) {
            fetchReferenceData();
        }
    }, [open, toast]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.gender || !formData.birthDate || !formData.category || !formData.purchaseDate) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Veuillez remplir tous les champs obligatoires"
            });
            return;
        }

        const cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
            name: formData.name,
            nickname: formData.nickname || undefined,
            gender: formData.gender as 'M' | 'F',
            birthDate: formData.birthDate,
            character: formData.character && formData.character !== 'none' ? {
                id: formData.character,
                name: characters.find(c => c.id === formData.character)?.name || ''
            } : undefined,
            category: {
                id: formData.category,
                name: categories.find(c => c.id === formData.category)?.name || ''
            },
            brand: formData.brand || undefined,
            distinctiveSign: formData.distinctiveSign || undefined,
            photo: undefined,
            status: {
                id: 'STAT001',
                name: 'Vivant'
            },
            source: {
                type: 'Acheté',
                supplier: formData.supplier || undefined,
                purchaseDate: formData.purchaseDate || undefined,
                purchaseCategory: formData.category,
                purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
                purchaseWeight: formData.purchaseWeight ? parseFloat(formData.purchaseWeight) : undefined,
                purchaseHealthStatus: formData.purchaseHealthStatus || undefined,
                purchaseNotes: formData.purchaseNotes || undefined,
            }
        };

        onAdd(cattleData);
        resetForm();
        onOpenChange(false);
    };

    const resetForm = () => {
        setFormData({
            name: '',
            nickname: '',
            gender: '',
            birthDate: '',
            character: 'none',
            category: '',
            brand: '',
            distinctiveSign: '',
            supplier: '',
            purchaseDate: '',
            purchasePrice: '',
            purchaseWeight: '',
            purchaseHealthStatus: '',
            purchaseNotes: ''
        });
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Nouvel achat</DialogTitle>
                    <DialogDescription>
                        Enregistrez l'achat d'un nouvel animal pour le troupeau.
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
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                    />
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
                                        onValueChange={(value) => setFormData({ ...formData, gender: value as 'M' | 'F' })}
                                    >
                                        <SelectTrigger id="gender">
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="M">Mâle</SelectItem>
                                            <SelectItem value="F">Femelle</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="category">Catégorie *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                                    >
                                        <SelectTrigger id="category">
                                            <SelectValue placeholder="Sélectionner" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                                    {cat.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="birthDate">Date de naissance *</Label>
                                    <Input
                                        id="birthDate"
                                        type="date"
                                        value={formData.birthDate}
                                        onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="character">Caractère</Label>
                                    <Select
                                        value={formData.character.toString()}
                                        onValueChange={(value) => setFormData({ ...formData, character: value })}
                                    >
                                        <SelectTrigger id="character">
                                            <SelectValue placeholder="Sélectionner (optionnel)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun</SelectItem>
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
                                    <Label htmlFor="distinctiveSign">Signe particulier</Label>
                                    <Input
                                        id="distinctiveSign"
                                        value={formData.distinctiveSign}
                                        onChange={(e) => setFormData({ ...formData, distinctiveSign: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Informations d'achat */}
                        <div>
                            <h3 className="text-lg font-medium mb-4">Informations d'achat</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="supplier">Fournisseur</Label>
                                    <Input
                                        id="supplier"
                                        value={formData.supplier}
                                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="purchaseDate">Date d'achat *</Label>
                                    <Input
                                        id="purchaseDate"
                                        type="date"
                                        value={formData.purchaseDate}
                                        onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="purchasePrice">Prix d'achat (Ar)</Label>
                                    <Input
                                        id="purchasePrice"
                                        type="number"
                                        step="0.01"
                                        value={formData.purchasePrice}
                                        onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="purchaseWeight">Poids à l'achat (kg)</Label>
                                    <Input
                                        id="purchaseWeight"
                                        type="number"
                                        step="0.01"
                                        value={formData.purchaseWeight}
                                        onChange={(e) => setFormData({ ...formData, purchaseWeight: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="purchaseHealthStatus">État de santé à l'achat</Label>
                                    <Input
                                        id="purchaseHealthStatus"
                                        value={formData.purchaseHealthStatus}
                                        onChange={(e) => setFormData({ ...formData, purchaseHealthStatus: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2 md:col-span-2">
                                    <Label htmlFor="purchaseNotes">Notes d'achat</Label>
                                    <Textarea
                                        id="purchaseNotes"
                                        value={formData.purchaseNotes}
                                        onChange={(e) => setFormData({ ...formData, purchaseNotes: e.target.value })}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer l'achat</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
