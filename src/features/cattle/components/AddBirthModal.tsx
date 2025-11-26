import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Cattle } from '@/features/cattle/types';
import { cattleService } from '@/features/cattle/services';
import { useEffect } from 'react';

interface AddBirthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onAdd: (calfData: Omit<Cattle, 'id' | 'events' | 'treatments'>) => void;
    motherName: string;
    motherId: number;
}

export const AddBirthModal: React.FC<AddBirthModalProps> = ({ open, onOpenChange, onAdd, motherName, motherId }) => {
    const [formData, setFormData] = useState({
        name: '',
        nickname: '',
        gender: '' as 'M' | 'F' | '',
        birthDate: new Date().toISOString().split('T')[0],
        character: 1,
        brand: '',
        distinctiveSign: '',
        birthDescription: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.name && formData.gender && formData.birthDate) {
            const calfData: Omit<Cattle, 'id' | 'events' | 'treatments'> = {
                name: formData.name,
                nickname: formData.nickname || undefined,
                gender: formData.gender as 'M' | 'F',
                birthDate: formData.birthDate,
                character: {
                    id: 'CHAR000',
                    name: 'Aucun'
                },
                category: {
                    id: 'CAT003',
                    name: 'Veau'
                },
                brand: formData.brand || undefined,
                distinctiveSign: formData.distinctiveSign || undefined,
                photo: undefined,
                status: {
                    id: 'STAT001',
                    name: 'Vivant'
                },
                source: {
                    type: 'Né dans le troupeau',
                    motherId: motherId
                }
            };

            onAdd(calfData);

            // Reset form
            setFormData({
                name: '',
                nickname: '',
                gender: '',
                birthDate: new Date().toISOString().split('T')[0],
                character: 1,
                brand: '',
                distinctiveSign: '',
                birthDescription: ''
            });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Enregistrer une naissance</DialogTitle>
                    <DialogDescription>
                        Enregistrez la naissance d'un veau pour {motherName}.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Nom du veau *</Label>
                                <Input
                                    id="name"
                                    placeholder="Ex: Petit Vato"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="nickname">Surnom</Label>
                                <Input
                                    id="nickname"
                                    placeholder="Ex: Vato"
                                    value={formData.nickname}
                                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Sexe *</Label>
                                <Select
                                    value={formData.gender}
                                    onValueChange={(value) => setFormData({ ...formData, gender: value as 'M' | 'F' })}
                                >
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Sélectionner le sexe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="M">Mâle</SelectItem>
                                        <SelectItem value="F">Femelle</SelectItem>
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="brand">Marque</Label>
                                <Input
                                    id="brand"
                                    placeholder="Ex: M-001"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="distinctiveSign">Signe particulier</Label>
                                <Input
                                    id="distinctiveSign"
                                    placeholder="Ex: Tache blanche"
                                    value={formData.distinctiveSign}
                                    onChange={(e) => setFormData({ ...formData, distinctiveSign: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="birthDescription">Description de la naissance (optionnel)</Label>
                            <Textarea
                                id="birthDescription"
                                placeholder="Ex: Naissance sans complications, poids 35kg"
                                value={formData.birthDescription}
                                onChange={(e) => setFormData({ ...formData, birthDescription: e.target.value })}
                                rows={3}
                            />
                        </div>

                        <div className="bg-muted/50 p-3 rounded-md">
                            <p className="text-sm text-muted-foreground">
                                <strong>Mère:</strong> {motherName}
                            </p>
                            <p className="text-sm text-muted-foreground mt-1">
                                Le veau sera automatiquement enregistré comme "Né dans le troupeau" avec la catégorie "Veau".
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Annuler
                        </Button>
                        <Button type="submit">Enregistrer</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
