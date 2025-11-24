import { Cattle } from '@/features/cattle/types';

// Liste des intervenants (vétérinaires et soignants)
const veterinarians: Record<string, string> = {
  'V001': 'Dr. Rakoto',
  'V002': 'Razafy',
  'V003': 'Dr. Nivo',
};

export const getVeterinarianName = (id: string | number): string => {
  return veterinarians[id.toString()] || `Vétérinaire ${id}`;
};

// Liste des médicaments
const medicaments: Record<string, string> = {
  'M001': 'Amoxicilline',
  'M002': 'Vaccin polyvalent',
  'M003': 'Ivermectine',
  'M004': 'Vaccin veau',
  'M005': 'Vaccin FMD',
  'M006': 'Vitamines prénatales',
  'M007': 'Calcium injectable',
};

export const getMedicamentName = (id: string | number): string => {
  return medicaments[id.toString()] || `Médicament ${id}`;
};

// Liste des types d'événements
const typeEvenements: Record<string, string> = {
  'TE001': 'Naissance',
  'TE002': 'Changement de pâturage',
  'TE003': 'Vaccination',
  'TE004': 'Visite vétérinaire',
  'TE005': 'Pesée',
  'TE006': 'Autre',
};

export const getTypeEvenementName = (id: string | number): string => {
  return typeEvenements[id.toString()] || `Type ${id}`;
};

// Icônes des types d'événements
const typeEvenementIcons: Record<string, string> = {
  'TE001': '🐄',
  'TE002': '🌱',
  'TE003': '💉',
  'TE004': '🩺',
  'TE005': '⚖️',
  'TE006': '📝',
};

export const getTypeEvenementIcon = (id: string | number): string => {
  return typeEvenementIcons[id.toString()] || '📝';
};

export const mockCattleData: Cattle[] = [
  {
    id: 'B001',
    name: 'Zébu Alpha',
    nickname: 'Le Chef',
    gender: 'M',
    birthDate: '2023-07-15',
    character: 'Docile',
    category: 'Taureau',
    brand: 'M-001',
    distinctiveSign: 'Tache blanche sur le flanc gauche',
    photo: '/src/assets/cattle-portrait-1.jpg',
    source: {
      type: 'Acheté',
      supplier: 'Ferme Mahitsy',
      purchaseDate: '2023-08-01',
      purchaseCategory: 'Veau',
      purchasePrice: 180000,
      purchaseWeight: 280,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Jeune taureau prometteur, bon potentiel reproducteur'
    },
    events: [
      {
        id: 'E001',
        type: 'TE001',
        date: '2023-07-15',
        description: 'Né dans l\'enclos 3',
        details: 'Naissance sans complications, poids 35kg'
      },
      {
        id: 'E002',
        type: 'TE002',
        date: '2024-01-10',
        description: 'Transféré vers pâturage nord',
        details: 'Meilleure qualité d\'herbe, plus d\'espace'
      },
      {
        id: 'E003',
        type: 'TE003',
        date: '2024-03-01',
        description: 'Vaccination annuelle complète'
      }
    ],
    treatments: [
      {
        id: 'T001',
        type: 'Antibiotique',
        date: '2024-03-05',
        product: 'M001',
        dosage: '10ml',
        veterinarian: 'V001',
        notes: 'Infection respiratoire légère'
      },
      {
        id: 'T002',
        type: 'Vaccin',
        date: '2024-03-01',
        product: 'M002',
        dosage: '2ml',
        veterinarian: 'V001'
      }
    ]
  },
  {
    id: 'B002',
    name: 'Belle Mahitsy',
    nickname: 'Bella',
    gender: 'F',
    birthDate: '2022-12-03',
    character: 'Timide',
    category: 'Vache',
    brand: 'M-002',
    photo: '/src/assets/cattle-portrait-2.jpg',
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 'E004',
        type: 'TE001',
        date: '2022-12-03',
        description: 'Née dans le troupeau principal'
      },
      {
        id: 'E005',
        type: 'TE005',
        date: '2024-02-15',
        description: 'Pesée mensuelle - 380kg'
      }
    ],
    treatments: [
      {
        id: 'T003',
        type: 'Vermifuge',
        date: '2024-02-20',
        product: 'M003',
        dosage: '15ml',
        veterinarian: 'V002'
      }
    ]
  },
  {
    id: 'B003',
    name: 'Petit Vato',
    nickname: 'Vato',
    gender: 'M',
    birthDate: '2024-01-20',
    character: 'Energique',
    category: 'Veau',
    distinctiveSign: 'Oreille droite fendue',
    photo: '/src/assets/cattle-portrait-3.jpg',
    source: {
      type: 'Né dans le troupeau',
      motherId: 'B008' // Ranitra Mendrika
    },
    events: [
      {
        id: 'E006',
        type: 'TE001',
        date: '2024-01-20',
        description: 'Veau né en bonne santé'
      },
      {
        id: 'E007',
        type: 'TE004',
        date: '2024-03-10',
        description: 'Contrôle de routine - excellent état'
      }
    ],
    treatments: [
      {
        id: 'T004',
        type: 'Vaccin',
        date: '2024-02-20',
        product: 'M004',
        dosage: '1ml',
        veterinarian: 'V001'
      }
    ]
  },
  {
    id: 'B004',
    name: 'Toky Mainty',
    gender: 'F',
    birthDate: '2023-05-12',
    character: 'Docile',
    category: 'Vache',
    source: {
      type: 'Acheté',
      supplier: 'Marché Ambohimanarina',
      purchaseDate: '2023-06-15',
      purchaseCategory: 'Vache',
      purchasePrice: 220000,
      purchaseWeight: 340,
      purchaseHealthStatus: 'Bon',
      purchaseNotes: 'Vache laitière, bonne production attendue'
    },
    events: [
      {
        id: 'E008',
        type: 'TE001',
        date: '2023-05-12',
        description: 'Née chez l\'ancien propriétaire'
      }
    ],
    treatments: []
  },
  {
    id: 'B005',
    name: 'Rambo Masina',
    gender: 'M',
    birthDate: '2022-08-22',
    character: 'Agressif',
    category: 'Taureau',
    source: {
      type: 'Acheté',
      supplier: 'Ferme Antsirabe',
      purchaseDate: '2023-01-10',
      purchaseCategory: 'Taureau',
      purchasePrice: 350000,
      purchaseWeight: 520,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Taureau reproducteur de qualité, lignée pure'
    },
    events: [
      {
        id: 'E009',
        type: 'TE003',
        date: '2024-02-10',
        description: 'Vaccination de rappel'
      }
    ],
    treatments: [
      {
        id: 'T005',
        type: 'Vaccin',
        date: '2024-02-10',
        product: 'M005',
        dosage: '3ml',
        veterinarian: 'V003'
      }
    ]
  },
  {
    id: 'B006',
    name: 'Miandry Fotsy',
    gender: 'F',
    birthDate: '2024-02-14',
    character: 'Timide',
    category: 'Veau',
    source: {
      type: 'Né dans le troupeau',
      motherId: 'B002' // Belle Mahitsy
    },
    events: [
      {
        id: 'E010',
        type: 'TE001',
        date: '2024-02-14',
        description: 'Veau femelle née le jour de la Saint-Valentin'
      }
    ],
    treatments: []
  },
  {
    id: 'B007',
    name: 'Kely Volamena',
    gender: 'M',
    birthDate: '2023-11-30',
    character: 'Energique',
    category: 'Veau',
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 'E011',
        type: 'TE001',
        date: '2023-11-30',
        description: 'Dernier né de l\'année 2023'
      }
    ],
    treatments: []
  },
  {
    id: 'B008',
    name: 'Ranitra Mendrika',
    gender: 'F',
    birthDate: '2022-04-08',
    character: 'Docile',
    category: 'Vache',
    source: {
      type: 'Acheté',
      supplier: 'Coopérative Fianarantsoa',
      purchaseDate: '2022-09-12',
      purchaseCategory: 'Vache',
      purchasePrice: 195000,
      purchaseWeight: 380,
      purchaseHealthStatus: 'Très bon',
      purchaseNotes: 'Bonne reproductrice, déjà gestante lors de l\'achat'
    },
    events: [
      {
        id: 'E012',
        type: 'TE006',
        date: '2024-01-05',
        description: 'Saillie réussie'
      }
    ],
    treatments: [
      {
        id: 'T006',
        type: 'Vitamine',
        date: '2024-01-20',
        product: 'M006',
        dosage: '20ml',
        veterinarian: 'V001'
      }
    ]
  },
  {
    id: 'B009',
    name: 'Lehibe Tandroka',
    gender: 'M',
    birthDate: '2021-12-10',
    character: 'Agressif',
    category: 'Taureau',
    source: {
      type: 'Acheté',
      supplier: 'Ferme Morondava',
      purchaseDate: '2022-03-15',
      purchaseCategory: 'Taureau',
      purchasePrice: 420000,
      purchaseWeight: 580,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Taureau dominant, nécessite enclos renforcé'
    },
    events: [
      {
        id: 'E013',
        type: 'TE002',
        date: '2024-03-20',
        description: 'Isolé temporairement'
      }
    ],
    treatments: []
  },
  {
    id: 'B010',
    name: 'Soa Mafy',
    gender: 'F',
    birthDate: '2023-09-05',
    character: 'Energique',
    category: 'Vache',
    source: {
      type: 'Né dans le troupeau',
      motherId: 'B004' // Toky Mainty
    },
    events: [
      {
        id: 'E014',
        type: 'TE005',
        date: '2024-03-15',
        description: 'Pesée de croissance - 280kg'
      }
    ],
    treatments: []
  },
  {
    id: 'B011',
    name: 'Vary Fotsy',
    gender: 'M',
    birthDate: '2023-03-18',
    character: 'Docile',
    category: 'Taureau',
    source: {
      type: 'Acheté',
      supplier: 'Marché Antananarivo',
      purchaseDate: '2023-07-22',
      purchaseCategory: 'Veau',
      purchasePrice: 160000,
      purchaseWeight: 250,
      purchaseHealthStatus: 'Bon',
      purchaseNotes: 'Jeune avec bon potentiel de croissance'
    },
    events: [
      {
        id: 'E015',
        type: 'TE004',
        date: '2024-02-28',
        description: 'Contrôle sanitaire mensuel'
      }
    ],
    treatments: []
  },
  {
    id: 'B012',
    name: 'Malala Tsara',
    gender: 'F',
    birthDate: '2022-06-25',
    character: 'Timide',
    category: 'Vache',
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 'E016',
        type: 'TE006',
        date: '2024-02-01',
        description: 'Gestation confirmée'
      }
    ],
    treatments: [
      {
        id: 'T007',
        type: 'Vitamine',
        date: '2024-02-15',
        product: 'M007',
        dosage: '25ml',
        veterinarian: 'V002'
      }
    ]
  }
];

export const getRecentEvents = () => {
  const allEvents = mockCattleData.flatMap(cattle =>
    cattle.events.map(event => ({
      ...event,
      cattleId: cattle.id,
      cattleName: cattle.name
    }))
  );

  return allEvents
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
};