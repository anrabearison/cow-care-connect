import { Cattle } from '@/features/cattle/types';

// Liste des intervenants (vétérinaires et soignants)
const veterinarians: Record<number, string> = {
  1: 'Dr. Rakoto',
  2: 'Razafy',
  3: 'Dr. Nivo',
};

export const getVeterinarianName = (id: string | number): string => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return veterinarians[numId] || `Vétérinaire ${id}`;
};

// Liste des médicaments
const medicaments: Record<number, string> = {
  1: 'Amoxicilline',
  2: 'Vaccin polyvalent',
  3: 'Ivermectine',
  4: 'Vaccin veau',
  5: 'Vaccin FMD',
  6: 'Vitamines prénatales',
  7: 'Calcium injectable',
};

export const getMedicamentName = (id: string | number): string => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return medicaments[numId] || `Médicament ${id}`;
};

// Liste des types d'événements
const typeEvenements: Record<number, string> = {
  1: 'Naissance',
  2: 'Changement de pâturage',
  3: 'Vaccination',
  4: 'Visite vétérinaire',
  5: 'Pesée',
  6: 'Autre',
};

export const getTypeEvenementName = (id: string | number): string => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return typeEvenements[numId] || `Type ${id}`;
};

// Icônes des types d'événements
const typeEvenementIcons: Record<number, string> = {
  1: '🐄',
  2: '🌱',
  3: '💉',
  4: '🩺',
  5: '⚖️',
  6: '📝',
};

export const getTypeEvenementIcon = (id: string | number): string => {
  const numId = typeof id === 'string' ? parseInt(id) : id;
  return typeEvenementIcons[numId] || '📝';
};

export const mockCattleData: Cattle[] = [
  {
    id: 1,
    name: 'Zébu Alpha',
    nickname: 'Le Chef',
    gender: 'M',
    birthDate: '2023-07-15',
    character: 'Docile',
    category: 1, // Taureau
    brand: 'M-001',
    distinctiveSign: 'Tache blanche sur le flanc gauche',
    photo: '/src/assets/cattle-portrait-1.jpg',
    source: {
      type: 'Acheté',
      supplier: 'Ferme Mahitsy',
      purchaseDate: '2023-08-01',
      purchaseCategory: 3, // Veau
      purchasePrice: 180000,
      purchaseWeight: 280,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Jeune taureau prometteur, bon potentiel reproducteur'
    },
    events: [
      {
        id: 1,
        type: 1, // Naissance
        date: '2023-07-15',
        description: 'Né dans l\'enclos 3',
        details: 'Naissance sans complications, poids 35kg'
      },
      {
        id: 2,
        type: 2, // Changement de pâturage
        date: '2024-01-10',
        description: 'Transféré vers pâturage nord',
        details: 'Meilleure qualité d\'herbe, plus d\'espace'
      },
      {
        id: 3,
        type: 3, // Vaccination
        date: '2024-03-01',
        description: 'Vaccination annuelle complète'
      }
    ],
    treatments: [
      {
        id: 1,
        type: 'Antibiotique',
        date: '2024-03-05',
        product: 1, // Amoxicilline
        dosage: '10ml',
        veterinarian: 1, // Dr. Rakoto
        notes: 'Infection respiratoire légère'
      },
      {
        id: 2,
        type: 'Vaccin',
        date: '2024-03-01',
        product: 2, // Vaccin polyvalent
        dosage: '2ml',
        veterinarian: 1 // Dr. Rakoto
      }
    ]
  },
  {
    id: 2,
    name: 'Belle Mahitsy',
    nickname: 'Bella',
    gender: 'F',
    birthDate: '2022-12-03',
    character: 'Timide',
    category: 2, // Vache
    brand: 'M-002',
    photo: '/src/assets/cattle-portrait-2.jpg',
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 4,
        type: 1, // Naissance
        date: '2022-12-03',
        description: 'Née dans le troupeau principal'
      },
      {
        id: 5,
        type: 5, // Pesée
        date: '2024-02-15',
        description: 'Pesée mensuelle - 380kg'
      }
    ],
    treatments: [
      {
        id: 3,
        type: 'Vermifuge',
        date: '2024-02-20',
        product: 3, // Ivermectine
        dosage: '15ml',
        veterinarian: 2 // Razafy
      }
    ]
  },
  {
    id: 3,
    name: 'Petit Vato',
    nickname: 'Vato',
    gender: 'M',
    birthDate: '2024-01-20',
    character: 'Energique',
    category: 3, // Veau
    distinctiveSign: 'Oreille droite fendue',
    photo: '/src/assets/cattle-portrait-3.jpg',
    source: {
      type: 'Né dans le troupeau',
      motherId: 8 // Ranitra Mendrika
    },
    events: [
      {
        id: 6,
        type: 1, // Naissance
        date: '2024-01-20',
        description: 'Veau né en bonne santé'
      },
      {
        id: 7,
        type: 4, // Visite vétérinaire
        date: '2024-03-10',
        description: 'Contrôle de routine - excellent état'
      }
    ],
    treatments: [
      {
        id: 4,
        type: 'Vaccin',
        date: '2024-02-20',
        product: 4, // Vaccin veau
        dosage: '1ml',
        veterinarian: 1 // Dr. Rakoto
      }
    ]
  },
  {
    id: 4,
    name: 'Toky Mainty',
    gender: 'F',
    birthDate: '2023-05-12',
    character: 'Docile',
    category: 2, // Vache
    source: {
      type: 'Acheté',
      supplier: 'Marché Ambohimanarina',
      purchaseDate: '2023-06-15',
      purchaseCategory: 2, // Vache
      purchasePrice: 220000,
      purchaseWeight: 340,
      purchaseHealthStatus: 'Bon',
      purchaseNotes: 'Vache laitière, bonne production attendue'
    },
    events: [
      {
        id: 8,
        type: 1, // Naissance
        date: '2023-05-12',
        description: 'Née chez l\'ancien propriétaire'
      }
    ],
    treatments: []
  },
  {
    id: 5,
    name: 'Rambo Masina',
    gender: 'M',
    birthDate: '2022-08-22',
    character: 'Agressif',
    category: 1, // Taureau
    source: {
      type: 'Acheté',
      supplier: 'Ferme Antsirabe',
      purchaseDate: '2023-01-10',
      purchaseCategory: 1, // Taureau
      purchasePrice: 350000,
      purchaseWeight: 520,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Taureau reproducteur de qualité, lignée pure'
    },
    events: [
      {
        id: 9,
        type: 3, // Vaccination
        date: '2024-02-10',
        description: 'Vaccination de rappel'
      }
    ],
    treatments: [
      {
        id: 5,
        type: 'Vaccin',
        date: '2024-02-10',
        product: 5, // Vaccin FMD
        dosage: '3ml',
        veterinarian: 3 // Dr. Nivo
      }
    ]
  },
  {
    id: 6,
    name: 'Miandry Fotsy',
    gender: 'F',
    birthDate: '2024-02-14',
    character: 'Timide',
    category: 3, // Veau
    source: {
      type: 'Né dans le troupeau',
      motherId: 2 // Belle Mahitsy
    },
    events: [
      {
        id: 10,
        type: 1, // Naissance
        date: '2024-02-14',
        description: 'Veau femelle née le jour de la Saint-Valentin'
      }
    ],
    treatments: []
  },
  {
    id: 7,
    name: 'Kely Volamena',
    gender: 'M',
    birthDate: '2023-11-30',
    character: 'Energique',
    category: 3, // Veau
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 11,
        type: 1, // Naissance
        date: '2023-11-30',
        description: 'Dernier né de l\'année 2023'
      }
    ],
    treatments: []
  },
  {
    id: 8,
    name: 'Ranitra Mendrika',
    gender: 'F',
    birthDate: '2022-04-08',
    character: 'Docile',
    category: 2, // Vache
    source: {
      type: 'Acheté',
      supplier: 'Coopérative Fianarantsoa',
      purchaseDate: '2022-09-12',
      purchaseCategory: 2, // Vache
      purchasePrice: 195000,
      purchaseWeight: 380,
      purchaseHealthStatus: 'Très bon',
      purchaseNotes: 'Bonne reproductrice, déjà gestante lors de l\'achat'
    },
    events: [
      {
        id: 12,
        type: 6, // Autre
        date: '2024-01-05',
        description: 'Saillie réussie'
      }
    ],
    treatments: [
      {
        id: 6,
        type: 'Vitamine',
        date: '2024-01-20',
        product: 6, // Vitamines prénatales
        dosage: '20ml',
        veterinarian: 1 // Dr. Rakoto
      }
    ]
  },
  {
    id: 9,
    name: 'Lehibe Tandroka',
    gender: 'M',
    birthDate: '2021-12-10',
    character: 'Agressif',
    category: 1, // Taureau
    source: {
      type: 'Acheté',
      supplier: 'Ferme Morondava',
      purchaseDate: '2022-03-15',
      purchaseCategory: 1, // Taureau
      purchasePrice: 420000,
      purchaseWeight: 580,
      purchaseHealthStatus: 'Excellent',
      purchaseNotes: 'Taureau dominant, nécessite enclos renforcé'
    },
    events: [
      {
        id: 13,
        type: 2, // Changement de pâturage
        date: '2024-03-20',
        description: 'Isolé temporairement'
      }
    ],
    treatments: []
  },
  {
    id: 10,
    name: 'Soa Mafy',
    gender: 'F',
    birthDate: '2023-09-05',
    character: 'Energique',
    category: 2, // Vache
    source: {
      type: 'Né dans le troupeau',
      motherId: 4 // Toky Mainty
    },
    events: [
      {
        id: 14,
        type: 5, // Pesée
        date: '2024-03-15',
        description: 'Pesée de croissance - 280kg'
      }
    ],
    treatments: []
  },
  {
    id: 11,
    name: 'Vary Fotsy',
    gender: 'M',
    birthDate: '2023-03-18',
    character: 'Docile',
    category: 1, // Taureau
    source: {
      type: 'Acheté',
      supplier: 'Marché Antananarivo',
      purchaseDate: '2023-07-22',
      purchaseCategory: 3, // Veau
      purchasePrice: 160000,
      purchaseWeight: 250,
      purchaseHealthStatus: 'Bon',
      purchaseNotes: 'Jeune avec bon potentiel de croissance'
    },
    events: [
      {
        id: 15,
        type: 4, // Visite vétérinaire
        date: '2024-02-28',
        description: 'Contrôle sanitaire mensuel'
      }
    ],
    treatments: []
  },
  {
    id: 12,
    name: 'Malala Tsara',
    gender: 'F',
    birthDate: '2022-06-25',
    character: 'Timide',
    category: 2, // Vache
    source: {
      type: 'Né dans le troupeau'
    },
    events: [
      {
        id: 16,
        type: 6, // Autre
        date: '2024-02-01',
        description: 'Gestation confirmée'
      }
    ],
    treatments: [
      {
        id: 7,
        type: 'Vitamine',
        date: '2024-02-15',
        product: 7, // Calcium injectable
        dosage: '25ml',
        veterinarian: 2 // Razafy
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