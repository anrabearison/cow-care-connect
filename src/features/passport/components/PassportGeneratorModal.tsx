import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2 } from 'lucide-react';
import { useHerdBookSelection } from '@/contexts/HerdBookSelectionContext';
import { useHerdBookCattle } from '@/features/herdbook/hooks';
import { CreatePassportDto } from '../types/passport.types';

interface PassportGeneratorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGenerate: (data: CreatePassportDto) => void;
  isGenerating?: boolean;
}

export function PassportGeneratorModal({ open, onOpenChange, onGenerate, isGenerating = false }: PassportGeneratorModalProps) {
  const { selectedHerdBookId } = useHerdBookSelection();
  const { data: herdBookCattleData } = useHerdBookCattle(selectedHerdBookId || '', 1, 1000);
  const herdBookCattle = herdBookCattleData?.data || [];
  
  const [selectedCattleIds, setSelectedCattleIds] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    passportNumber: '',
    location: '',
    issueDate: new Date().toISOString().split('T')[0],
    district: '',
    applicantName: '',
    cinNumber: '',
    cinIssueDate: '',
    cinIssueLocation: '',
    residenceCommune: '',
    village: '',
    commune: '',
    residenceDistrict: '',
    region: '',
    purchaseCommune: '',
    verificationDate: new Date().toISOString().split('T')[0],
    arreteDate: new Date().toISOString().split('T')[0],
  });

  const handleCattleToggle = (cattleId: string) => {
    setSelectedCattleIds(prev =>
      prev.includes(cattleId)
        ? prev.filter(id => id !== cattleId)
        : [...prev, cattleId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCattleIds.length === 0) {
      alert('Veuillez sélectionner au moins un bœuf');
      return;
    }

    if (!selectedHerdBookId) {
      alert('Veuillez sélectionner un livre de troupeau');
      return;
    }

    const passportData: CreatePassportDto = {
      ...formData,
      herdBookId: selectedHerdBookId,
      totalCattle: selectedCattleIds.length,
      cattleIds: selectedCattleIds,
    };

    onGenerate(passportData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Génération de Passeport Bovin
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations requises pour générer le passeport de transfert
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <ScrollArea className="flex-1 max-h-[60vh] px-6">
            <div className="space-y-6 pb-6">
              {/* Cattle Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sélection des Bœufs</CardTitle>
                  <CardDescription>
                    Sélectionnez les bœufs à inclure dans ce passeport ({selectedCattleIds.length} sélectionné{selectedCattleIds.length > 1 ? 's' : ''})
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-48 border rounded-md p-2">
                    <div className="space-y-2">
                      {herdBookCattle.map((hbc) => (
                        <div
                          key={hbc.id}
                          className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md"
                        >
                          <Checkbox
                            id={hbc.id}
                            checked={selectedCattleIds.includes(hbc.id)}
                            onCheckedChange={() => handleCattleToggle(hbc.id)}
                          />
                          <Label
                            htmlFor={hbc.id}
                            className="flex-1 cursor-pointer flex items-center gap-2"
                          >
                            <span className="font-medium">{hbc.cattle?.name || 'N/A'}</span>
                            <Badge variant="outline" className="text-xs">
                              {hbc.n_carnet || 'N/A'}
                            </Badge>
                            <span className="text-muted-foreground text-sm">
                              - {hbc.cattle?.character?.name || 'N/A'}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Emission Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations d'Émission</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="passportNumber">Numéro de Passeport *</Label>
                    <Input
                      id="passportNumber"
                      value={formData.passportNumber}
                      onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                      placeholder="PASS-2024-0001"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Lieu d'émission *</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issueDate">Date d'émission *</Label>
                    <Input
                      id="issueDate"
                      type="date"
                      value={formData.issueDate}
                      onChange={(e) => handleInputChange('issueDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-3">
                    <Label htmlFor="district">Arrondissement *</Label>
                    <Input
                      id="district"
                      value={formData.district}
                      onChange={(e) => handleInputChange('district', e.target.value)}
                      placeholder="Antananarivo I"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Applicant Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations du Demandeur</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="applicantName">Nom du demandeur *</Label>
                    <Input
                      id="applicantName"
                      value={formData.applicantName}
                      onChange={(e) => handleInputChange('applicantName', e.target.value)}
                      placeholder="Jean Rasoanaivo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cinNumber">Numéro CIN *</Label>
                    <Input
                      id="cinNumber"
                      value={formData.cinNumber}
                      onChange={(e) => handleInputChange('cinNumber', e.target.value)}
                      placeholder="101 234 567 890"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cinIssueDate">Date CIN *</Label>
                    <Input
                      id="cinIssueDate"
                      type="date"
                      value={formData.cinIssueDate}
                      onChange={(e) => handleInputChange('cinIssueDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cinIssueLocation">Lieu CIN *</Label>
                    <Input
                      id="cinIssueLocation"
                      value={formData.cinIssueLocation}
                      onChange={(e) => handleInputChange('cinIssueLocation', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Residence Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de Résidence</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="residenceCommune">Commune de résidence *</Label>
                    <Input
                      id="residenceCommune"
                      value={formData.residenceCommune}
                      onChange={(e) => handleInputChange('residenceCommune', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="village">Village *</Label>
                    <Input
                      id="village"
                      value={formData.village}
                      onChange={(e) => handleInputChange('village', e.target.value)}
                      placeholder="67 Ha"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="commune">Kaominina *</Label>
                    <Input
                      id="commune"
                      value={formData.commune}
                      onChange={(e) => handleInputChange('commune', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="residenceDistrict">Distrika *</Label>
                    <Input
                      id="residenceDistrict"
                      value={formData.residenceDistrict}
                      onChange={(e) => handleInputChange('residenceDistrict', e.target.value)}
                      placeholder="Antananarivo I"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="region">Faritra *</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleInputChange('region', e.target.value)}
                      placeholder="Analamanga"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Transfer Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de Transfert</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchaseCommune">Commune du lieu d'achat *</Label>
                    <Input
                      id="purchaseCommune"
                      value={formData.purchaseCommune}
                      onChange={(e) => handleInputChange('purchaseCommune', e.target.value)}
                      placeholder="Antananarivo"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Verification Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Informations de Vérification</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="verificationDate">Date de vérification *</Label>
                    <Input
                      id="verificationDate"
                      type="date"
                      value={formData.verificationDate}
                      onChange={(e) => handleInputChange('verificationDate', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="arreteDate">Date de l'arrêté *</Label>
                    <Input
                      id="arreteDate"
                      type="date"
                      value={formData.arreteDate}
                      onChange={(e) => handleInputChange('arreteDate', e.target.value)}
                      required
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>

          <DialogFooter className="gap-2 p-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isGenerating}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isGenerating || selectedCattleIds.length === 0}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Génération...
                </>
              ) : (
                'Générer le Passeport'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
