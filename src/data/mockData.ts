import { Cattle } from '@/types/cattle';

export const mockCattleData: Cattle[] = [
  {
    id: 'B001',
    nom: 'Zébu Alpha',
    genre: 'M',
    dateNaissance: '2023-07-15',
    caractere: 'Docile',
    photo: '/src/assets/cattle-portrait-1.jpg',
    source: {
      type: 'Acheté',
      fournisseur: 'Ferme Mahitsy',
      dateAchat: '2023-08-01'
    },
    evenements: [
      {
        id: 'E001',
        type: 'Naissance',
        date: '2023-07-15',
        description: 'Né dans l\'enclos 3',
        details: 'Naissance sans complications, poids 35kg'
      },
      {
        id: 'E002',
        type: 'Changement de pâturage',
        date: '2024-01-10',
        description: 'Transféré vers pâturage nord',
        details: 'Meilleure qualité d\'herbe, plus d\'espace'
      },
      {
        id: 'E003',
        type: 'Vaccination',
        date: '2024-03-01',
        description: 'Vaccination annuelle complète'
      }
    ],
    traitements: [
      {
        id: 'T001',
        type: 'Antibiotique',
        date: '2024-03-05',
        produit: 'Amoxicilline',
        dose: '10ml',
        veterinaire: 'Dr. Rakoto',
        notes: 'Infection respiratoire légère'
      },
      {
        id: 'T002',
        type: 'Vaccin',
        date: '2024-03-01',
        produit: 'Vaccin polyvalent',
        dose: '2ml',
        veterinaire: 'Dr. Rakoto'
      }
    ]
  },
  {
    id: 'B002',
    nom: 'Belle Mahitsy',
    genre: 'F',
    dateNaissance: '2022-12-03',
    caractere: 'Timide',
    photo: '/src/assets/cattle-portrait-2.jpg',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E004',
        type: 'Naissance',
        date: '2022-12-03',
        description: 'Née dans le troupeau principal'
      },
      {
        id: 'E005',
        type: 'Pesée',
        date: '2024-02-15',
        description: 'Pesée mensuelle - 380kg'
      }
    ],
    traitements: [
      {
        id: 'T003',
        type: 'Vermifuge',
        date: '2024-02-20',
        produit: 'Ivermectine',
        dose: '15ml',
        veterinaire: 'Dr. Andry'
      }
    ]
  },
  {
    id: 'B003',
    nom: 'Petit Vato',
    genre: 'M',
    dateNaissance: '2024-01-20',
    caractere: 'Energique',
    photo: '/src/assets/cattle-portrait-3.jpg',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E006',
        type: 'Naissance',
        date: '2024-01-20',
        description: 'Veau né en bonne santé'
      },
      {
        id: 'E007',
        type: 'Visite vétérinaire',
        date: '2024-03-10',
        description: 'Contrôle de routine - excellent état'
      }
    ],
    traitements: [
      {
        id: 'T004',
        type: 'Vaccin',
        date: '2024-02-20',
        produit: 'Vaccin veau',
        dose: '1ml',
        veterinaire: 'Dr. Rakoto'
      }
    ]
  }
];

export const getRecentEvents = () => {
  const allEvents = mockCattleData.flatMap(cattle => 
    cattle.evenements.map(event => ({
      ...event,
      cattleId: cattle.id,
      cattleName: cattle.nom
    }))
  );
  
  return allEvents
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};