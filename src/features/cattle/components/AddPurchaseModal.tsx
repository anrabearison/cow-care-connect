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
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { Calendar } from 'lucide-react';

interface AddPurchaseModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (cattleData: Omit<Cattle, 'id' | 'events' | 'treatments'>, herdBookId?: string) => void;
}

export const AddPurchaseModal: React.FC<AddPurchaseModalProps> = ({ open, onOpenChange, onAdd }) => {
    const { toast } = useToast();
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [characters, setCharacters] = useState<{ id: string, name: string }[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});

    // HerdBook selection
    const { availableHerdBooks, selectedHerdBookId: contextHerdBookId } = useHerdBookSelection();
    const [selectedHerdBookId, setSelectedHerdBookId] = useState<string>('');

    useEffect(() => {
        if (open) {
            if (contextHerdBookId) {
                setSelectedHerdBookId(contextHerdBookId);
            } else if (availableHerdBooks.length > 0) {
                // Default to most recent
                const sorted = [...availableHerdBooks].sort((a, b) => b.year - a.year);
                setSelectedHerdBookId(sorted[0].id);
            }
        }
    }, [open, contextHerdBookId, availableHerdBooks]);

    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: '' as 'M' | 'F' | '',
        birthDate: '',
        character: 'none',
        category: '',
        brand: '',
        distinctiveSign: ''
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


    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = "Le nom est obligatoire";
        if (!formData.gender) newErrors.gender = "Le sexe est obligatoire";
        if (!formData.birthDate) newErrors.birthDate = "La date de naissance est obligatoire";
        if (!formData.category) newErrors.category = "La catégorie est obligatoire";
        if (!selectedHerdBookId) newErrors.herdBook = "Le livre de troupeau est obligatoire";

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
            // status removed as not supported by backend on create
            source: {
                type: 'ACHETE'
            }
        };

        onAdd(cattleData, selectedHerdBookId);
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
            distinctiveSign: ''
        });
        setErrors({});
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

                            {/* HerdBook Selection */}
                            <div className="mb-4">
                                <Label htmlFor="herdBook">Livre de troupeau *</Label>
                                <Select
                                    value={selectedHerdBookId}
                                    onValueChange={(value) => {
                                        setSelectedHerdBookId(value);
                                        if (errors.herdBook) setErrors({ ...errors, herdBook: '' });
                                    }}
                                >
                                    <SelectTrigger id="herdBook" className={errors.herdBook ? 'border-red-500' : ''}>
                                        <SelectValue placeholder="Sélectionner un livre de troupeau" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableHerdBooks
                                            .sort((a, b) => b.year - a.year)
                                            .map((hb) => (
                                                <SelectItem key={hb.id} value={hb.id}>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                                        <span>{hb.year} - {hb.reference}</span>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                    </SelectContent>
                                </Select>
                                {errors.herdBook && <p className="text-sm text-red-500">{errors.herdBook}</p>}
                            </div>

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
                                    <Label htmlFor="category">Catégorie *</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(value) => {
                                            setFormData({ ...formData, category: value });
                                            if (errors.category) setErrors({ ...errors, category: '' });
                                        }}
                                    >
                                        <SelectTrigger id="category" className={errors.category ? 'border-red-500' : ''}>
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
                                    {errors.category && <p className="text-sm text-red-500">{errors.category}</p>}
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
                            <div className="p-4 bg-muted/20 rounded-md border text-sm text-muted-foreground">
                                Les détails d'achat spécifiques (fournisseur, prix, etc.) seront gérés dans le module "Achats & Ventes". L'animal sera bien enregistré comme "Acheté".
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex-col sm:flex-row gap-2">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
                            Annuler
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto">Enregistrer l'achat</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
