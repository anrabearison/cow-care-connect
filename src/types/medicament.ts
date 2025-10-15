export interface Medicament {
  id: string;
  nom: string;
  type: 'Antibiotique' | 'Vaccin' | 'Vermifuge' | 'Anti-inflammatoire' | 'Vitamine' | 'Autre';
  dosageRecommande?: string;
  fabricant?: string;
  notes?: string;
}
