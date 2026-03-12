export interface Medicament {
  id: string;
  nom: string;
  type: 'ANTIBIOTIQUE' | 'VACCIN' | 'VERMIFUGE' | 'ANTI_INFLAMMATOIRE' | 'VITAMINE' | 'AUTRE';
  dosageRecommande?: string;
  fabricant?: string;
  notes?: string;
}
