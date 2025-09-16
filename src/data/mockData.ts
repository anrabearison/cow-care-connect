import { Cattle } from '@/types/cattle';

export const mockCattleData: Cattle[] = [
  {
    id: 'B001',
    nom: 'Zébu Alpha',
    genre: 'M',
    dateNaissance: '2023-07-15',
    caractere: 'Docile',
    categorie: 'Taureau',
    photo: '/src/assets/cattle-portrait-1.jpg',
    source: {
      type: 'Acheté',
      fournisseur: 'Ferme Mahitsy',
      dateAchat: '2023-08-01',
      categorieAchat: 'Veau',
      prixAchat: 180000,
      poidsAchat: 280,
      etatSanteAchat: 'Excellent',
      remarquesAchat: 'Jeune taureau prometteur, bon potentiel reproducteur'
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
    categorie: 'Vache',
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
    categorie: 'Veau',
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
  },
  {
    id: 'B004',
    nom: 'Toky Mainty',
    genre: 'F',
    dateNaissance: '2023-05-12',
    caractere: 'Docile',
    categorie: 'Vache',
    source: {
      type: 'Acheté',
      fournisseur: 'Marché Ambohimanarina',
      dateAchat: '2023-06-15',
      categorieAchat: 'Vache',
      prixAchat: 220000,
      poidsAchat: 340,
      etatSanteAchat: 'Bon',
      remarquesAchat: 'Vache laitière, bonne production attendue'
    },
    evenements: [
      {
        id: 'E008',
        type: 'Naissance',
        date: '2023-05-12',
        description: 'Née chez l\'ancien propriétaire'
      }
    ],
    traitements: []
  },
  {
    id: 'B005',
    nom: 'Rambo Masina',
    genre: 'M',
    dateNaissance: '2022-08-22',
    caractere: 'Agressif',
    categorie: 'Taureau',
    source: {
      type: 'Acheté',
      fournisseur: 'Ferme Antsirabe',
      dateAchat: '2023-01-10',
      categorieAchat: 'Taureau',
      prixAchat: 350000,
      poidsAchat: 520,
      etatSanteAchat: 'Excellent',
      remarquesAchat: 'Taureau reproducteur de qualité, lignée pure'
    },
    evenements: [
      {
        id: 'E009',
        type: 'Vaccination',
        date: '2024-02-10',
        description: 'Vaccination de rappel'
      }
    ],
    traitements: [
      {
        id: 'T005',
        type: 'Vaccin',
        date: '2024-02-10',
        produit: 'Vaccin FMD',
        dose: '3ml',
        veterinaire: 'Dr. Rasoa'
      }
    ]
  },
  {
    id: 'B006',
    nom: 'Miandry Fotsy',
    genre: 'F',
    dateNaissance: '2024-02-14',
    caractere: 'Timide',
    categorie: 'Veau',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E010',
        type: 'Naissance',
        date: '2024-02-14',
        description: 'Veau femelle née le jour de la Saint-Valentin'
      }
    ],
    traitements: []
  },
  {
    id: 'B007',
    nom: 'Kely Volamena',
    genre: 'M',
    dateNaissance: '2023-11-30',
    caractere: 'Energique',
    categorie: 'Veau',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E011',
        type: 'Naissance',
        date: '2023-11-30',
        description: 'Dernier né de l\'année 2023'
      }
    ],
    traitements: []
  },
  {
    id: 'B008',
    nom: 'Ranitra Mendrika',
    genre: 'F',
    dateNaissance: '2022-04-08',
    caractere: 'Docile',
    categorie: 'Vache',
    source: {
      type: 'Acheté',
      fournisseur: 'Coopérative Fianarantsoa',
      dateAchat: '2022-09-12',
      categorieAchat: 'Vache',
      prixAchat: 195000,
      poidsAchat: 380,
      etatSanteAchat: 'Très bon',
      remarquesAchat: 'Bonne reproductrice, déjà gestante lors de l\'achat'
    },
    evenements: [
      {
        id: 'E012',
        type: 'Autre',
        date: '2024-01-05',
        description: 'Saillie réussie'
      }
    ],
    traitements: [
      {
        id: 'T006',
        type: 'Autre',
        date: '2024-01-20',
        produit: 'Vitamines prénatales',
        dose: '20ml',
        veterinaire: 'Dr. Hery'
      }
    ]
  },
  {
    id: 'B009',
    nom: 'Lehibe Tandroka',
    genre: 'M',
    dateNaissance: '2021-12-10',
    caractere: 'Agressif',
    categorie: 'Taureau',
    source: {
      type: 'Acheté',
      fournisseur: 'Ferme Morondava',
      dateAchat: '2022-03-15',
      categorieAchat: 'Taureau',
      prixAchat: 420000,
      poidsAchat: 580,
      etatSanteAchat: 'Excellent',
      remarquesAchat: 'Taureau dominant, nécessite enclos renforcé'
    },
    evenements: [
      {
        id: 'E013',
        type: 'Changement de pâturage',
        date: '2024-03-20',
        description: 'Isolé temporairement'
      }
    ],
    traitements: []
  },
  {
    id: 'B010',
    nom: 'Soa Mafy',
    genre: 'F',
    dateNaissance: '2023-09-05',
    caractere: 'Energique',
    categorie: 'Vache',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E014',
        type: 'Pesée',
        date: '2024-03-15',
        description: 'Pesée de croissance - 280kg'
      }
    ],
    traitements: []
  },
  {
    id: 'B011',
    nom: 'Vary Fotsy',
    genre: 'M',
    dateNaissance: '2023-03-18',
    caractere: 'Docile',
    categorie: 'Taureau',
    source: {
      type: 'Acheté',
      fournisseur: 'Marché Antananarivo',
      dateAchat: '2023-07-22',
      categorieAchat: 'Veau',
      prixAchat: 160000,
      poidsAchat: 250,
      etatSanteAchat: 'Bon',
      remarquesAchat: 'Jeune avec bon potentiel de croissance'
    },
    evenements: [
      {
        id: 'E015',
        type: 'Visite vétérinaire',
        date: '2024-02-28',
        description: 'Contrôle sanitaire mensuel'
      }
    ],
    traitements: []
  },
  {
    id: 'B012',
    nom: 'Malala Tsara',
    genre: 'F',
    dateNaissance: '2022-06-25',
    caractere: 'Timide',
    categorie: 'Vache',
    source: {
      type: 'Né dans le troupeau'
    },
    evenements: [
      {
        id: 'E016',
        type: 'Autre',
        date: '2024-02-01',
        description: 'Gestation confirmée'
      }
    ],
    traitements: [
      {
        id: 'T007',
        type: 'Autre',
        date: '2024-02-15',
        produit: 'Calcium',
        dose: '25ml',
        veterinaire: 'Dr. Nirina'
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