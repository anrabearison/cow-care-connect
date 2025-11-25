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

interface AddCattleModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>) => void;
}

export const AddCattleModal: React.FC<AddCattleModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: '' as 'M' | 'F' | '',
        birthDate: '',
        character: 'Docile' as 'Docile' | 'Timide' | 'Energique' | 'Agressif',
        category: '',
        brand: '',
        herdBookNumber: '',
        distinctiveSign: '',
        sourceType: 'Acheté' as 'Acheté' | 'Né dans le troupeau',
        // Purchase fields
        supplier: '',
        purchaseDate: '',
        purchasePrice: '',
        purchaseWeight: '',
        purchaseHealthStatus: '',
        purchaseNotes: ''
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const response = await referenceService.getCategories();
            if (response.success) {
                setCategories(response.data);
            } else {
                toast({
                    variant: "destructive",
                    title: "Erreur",
                    description: "Impossible de charger les catégories"
                });
            }
        };

        if (open) {
            fetchCategories();
        }
    }, [open, toast]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.gender || !formData.birthDate || !formData.category) {
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
            character: formData.character,
            category: parseInt(formData.category),
            brand: formData.brand || undefined,
            herdBookNumber: formData.herdBookNumber ? parseInt(formData.herdBookNumber) : undefined,
            distinctiveSign: formData.distinctiveSign || undefined,
            photo: undefined,
            source: {
                type: formData.sourceType,
                supplier: formData.sourceType === 'Acheté' ? formData.supplier : undefined,
                purchaseDate: formData.sourceType === 'Acheté' ? formData.purchaseDate : undefined,
                purchaseCategory: formData.sourceType === 'Acheté' ? parseInt(formData.category) : undefined, // Assuming purchase category is same as current category for now
                purchasePrice: formData.sourceType === 'Acheté' && formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
                purchaseWeight: formData.sourceType === 'Acheté' && formData.purchaseWeight ? parseFloat(formData.purchaseWeight) : undefined,
                purchaseHealthStatus: formData.sourceType === 'Acheté' ? formData.purchaseHealthStatus : undefined,
                purchaseNotes: formData.sourceType === 'Acheté' ? formData.purchaseNotes : undefined,
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
            character: 'Docile',
            category: '',
            brand: '',
            herdBookNumber: '',
            distinctiveSign: '',
            sourceType: 'Acheté',
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
                                        value={formData.character}
                                        onValueChange={(value) => setFormData({ ...formData, character: value as any })}
                                    >
                                        <SelectTrigger id="character">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Docile">Docile</SelectItem>
                                            <SelectItem value="Timide">Timide</SelectItem>
                                            <SelectItem value="Energique">Énergique</SelectItem>
                                            <SelectItem value="Agressif">Agressif</SelectItem>
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
                                    <Label htmlFor="herdBookNumber">Numéro Herd Book</Label>
                                    <Input
                                        id="herdBookNumber"
                                        type="number"
                                        value={formData.herdBookNumber}
                                        onChange={(e) => setFormData({ ...formData, herdBookNumber: e.target.value })}
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
                                        onValueChange={(value) => setFormData({ ...formData, sourceType: value as any })}
                                    >
                                        <SelectTrigger id="sourceType">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Acheté">Acheté</SelectItem>
                                            <SelectItem value="Né dans le troupeau">Né dans le troupeau</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {formData.sourceType === 'Acheté' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-muted/20">
                                        <div className="grid gap-2">
                                            <Label htmlFor="supplier">Fournisseur</Label>
                                            <Input
                                                id="supplier"
                                                value={formData.supplier}
                                                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
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
