import fakeRestProvider from 'ra-data-fakerest';
import type { DataProvider } from 'react-admin';
import { mockCattleData } from '@/data/mockData';
import { categories } from '@/data/categories';

// Aplatir les événements et traitements de tous les bovins
const allEvenements = mockCattleData.flatMap(cattle =>
  cattle.events.map(event => ({
    ...event,
    cattleId: cattle.id
  }))
);

const allTraitements = mockCattleData.flatMap(cattle =>
  cattle.treatments.map(treatment => ({
    ...treatment,
    cattleId: cattle.id
  }))
);

const db = {
  cattle: mockCattleData,
  events: allEvenements,
  treatments: allTraitements,
  categories: categories,
  users: [
    { id: 1, name: 'Jean Rakoto', email: 'admin@ferme.mg', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Livia Raso', email: 'livia@ferme.mg', role: 'manager', password: 'secret' },
    { id: 3, name: 'Tiana Andry', email: 'tiana@ferme.mg', role: 'viewer', password: 'secret' },
    { id: 4, name: 'Hery Rana', email: 'hery@ferme.mg', role: 'manager', password: 'secret' },
  ],
  veterinarians: [
    { id: 'V001', nom: 'Dr. Rakoto', specialite: 'Vétérinaire', telephone: '+261 34 12 345 67', email: 'rakoto@vet.mg', adresse: 'Antananarivo', notes: 'Disponible les jours ouvrables' },
    { id: 'V002', nom: 'Razafy', specialite: 'Soins de base', telephone: '+261 34 23 456 78', email: 'razafy@ferme.mg', adresse: 'Antsirabe', notes: 'Éleveur expérimenté' },
    { id: 'V003', nom: 'Dr. Nivo', specialite: 'Vétérinaire spécialiste bovins', telephone: '+261 34 34 567 89', email: 'nivo@vet.mg', adresse: 'Fianarantsoa', notes: '' }
  ],
  medicaments: [
    { id: 'M001', nom: 'Amoxicilline', type: 'Antibiotique', dosageRecommande: '10ml par 100kg', fabricant: 'VetPharma', notes: 'Pour infections respiratoires' },
    { id: 'M002', nom: 'Vaccin polyvalent', type: 'Vaccin', dosageRecommande: '2ml', fabricant: 'BioVet', notes: 'Protection contre maladies courantes' },
    { id: 'M003', nom: 'Ivermectine', type: 'Vermifuge', dosageRecommande: '15ml par 100kg', fabricant: 'AnimalHealth', notes: 'Traitement antiparasitaire' },
    { id: 'M004', nom: 'Vaccin veau', type: 'Vaccin', dosageRecommande: '1ml', fabricant: 'BioVet', notes: 'Spécial jeunes bovins' },
    { id: 'M005', nom: 'Vaccin FMD', type: 'Vaccin', dosageRecommande: '3ml', fabricant: 'VetPharma', notes: 'Fièvre aphteuse' },
    { id: 'M006', nom: 'Vitamines prénatales', type: 'Vitamine', dosageRecommande: '20ml', fabricant: 'NutriVet', notes: 'Pour vaches gestantes' },
    { id: 'M007', nom: 'Calcium injectable', type: 'Vitamine', dosageRecommande: '25ml', fabricant: 'NutriVet', notes: 'Prévention fièvre de lait' }
  ],
  typeEvenements: [
    { id: 'TE001', nom: 'Naissance', description: 'Naissance d\'un bovin', icone: '🐄' },
    { id: 'TE002', nom: 'Changement de pâturage', description: 'Déplacement vers un nouveau pâturage', icone: '🌱' },
    { id: 'TE003', nom: 'Vaccination', description: 'Administration d\'un vaccin', icone: '💉' },
    { id: 'TE004', nom: 'Visite vétérinaire', description: 'Visite de contrôle ou de soins', icone: '🩺' },
    { id: 'TE005', nom: 'Pesée', description: 'Pesée de contrôle', icone: '⚖️' },
    { id: 'TE006', nom: 'Autre', description: 'Autre type d\'événement', icone: '📝' }
  ]
};

// Handle potential double default export (ESM/CJS interop)
const providerFactory = (fakeRestProvider as any).default ?? fakeRestProvider;
const baseDataProvider = providerFactory(db, true);

export const dataProvider: DataProvider = {
  ...baseDataProvider,
  create: async (resource, params) => {
    if (resource === 'categories') {
      // Vérifier l'unicité du nom
      const { data: existingData } = await baseDataProvider.getList('categories', {
        filter: { q: params.data.name }, // fakeRestProvider utilise 'q' pour la recherche textuelle ou filtre exact si supporté
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' }
      });

      // Filtrage manuel car le mock provider peut être limité
      const exists = existingData.some((c: any) => c.name.toLowerCase() === params.data.name.toLowerCase());
      if (exists) {
        return Promise.reject(new Error('Une catégorie avec ce nom existe déjà.'));
      }

      // Auto-incrément ID
      const { data: allCategories } = await baseDataProvider.getList('categories', {
        pagination: { page: 1, perPage: 1000 },
        sort: { field: 'id', order: 'DESC' }
      });

      const maxId = allCategories.length > 0 ? Number(allCategories[0].id) : 0;

      return baseDataProvider.create(resource, {
        ...params,
        data: { ...params.data, id: maxId + 1 }
      });
    }
    return baseDataProvider.create(resource, params);
  },
  update: async (resource, params) => {
    if (resource === 'categories') {
      // Vérifier l'unicité du nom (exclusion de l'ID courant)
      const { data: existingData } = await baseDataProvider.getList('categories', {
        pagination: { page: 1, perPage: 100 },
        sort: { field: 'id', order: 'ASC' }
      });

      const exists = existingData.some((c: any) =>
        c.name.toLowerCase() === params.data.name.toLowerCase() && c.id !== params.id
      );

      if (exists) {
        return Promise.reject(new Error('Une catégorie avec ce nom existe déjà.'));
      }
    }
    return baseDataProvider.update(resource, params);
  }
};