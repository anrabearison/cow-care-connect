import fakeRestProvider from 'ra-data-fakerest';
import type { DataProvider } from 'react-admin';
import cattle1 from '@/assets/cattle-portrait-1.jpg';
import cattle2 from '@/assets/cattle-portrait-2.jpg';
import cattle3 from '@/assets/cattle-portrait-3.jpg';

const db = {
  cattle: [
    {
      id: 1,
      nom: 'Zébu Alpha',
      breed: 'Zébu',
      genre: 'M',
      categorie: 'Taureau',
      age: 2,
      weight: 420,
      healthStatus: 'Bon',
      birthDate: '2023-07-15',
      image: cattle1,
      location: 'Pâturage Nord',
      notes: 'Caractère docile, bon état général.'
    },
    {
      id: 2,
      nom: 'Belle Mahitsy',
      breed: 'Holstein',
      genre: 'F',
      categorie: 'Vache',
      age: 3,
      weight: 510,
      healthStatus: 'Excellent',
      birthDate: '2022-12-03',
      image: cattle2,
      location: 'Enclos Principal',
      notes: 'Montée de lait régulière.'
    },
    {
      id: 3,
      nom: 'Petit Vato',
      breed: 'Limousine',
      genre: 'M',
      categorie: 'Veau',
      age: 1,
      weight: 280,
      healthStatus: 'Bon',
      birthDate: '2024-01-20',
      image: cattle3,
      location: 'Pâturage Est',
      notes: 'Énergique, croissance rapide.'
    },
    {
      id: 4,
      nom: 'Toky Mainty',
      breed: 'Zébu',
      genre: 'F',
      categorie: 'Zébu',
      age: 2,
      weight: 390,
      healthStatus: 'Moyen',
      birthDate: '2023-05-12',
      image: cattle1,
      location: 'Pâturage Sud',
      notes: 'Surveillance digestive.'
    },
    {
      id: 5,
      nom: 'Rambo Masina',
      breed: 'Zébu',
      genre: 'M',
      categorie: 'Taureau',
      age: 4,
      weight: 610,
      healthStatus: 'Bon',
      birthDate: '2021-08-22',
      image: cattle2,
      location: 'Enclos Isolé',
      notes: 'Tempérament dominant.'
    },
    {
      id: 6,
      nom: 'Soa Mafy',
      breed: 'Zébu',
      genre: 'F',
      categorie: 'Vache',
      age: 2,
      weight: 350,
      healthStatus: 'Excellent',
      birthDate: '2023-09-05',
      image: cattle3,
      location: 'Pâturage Ouest',
      notes: ''
    }
  ],
  users: [
    { id: 1, name: 'Jean Rakoto', email: 'admin@ferme.mg', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Livia Raso', email: 'livia@ferme.mg', role: 'manager', password: 'secret' },
    { id: 3, name: 'Tiana Andry', email: 'tiana@ferme.mg', role: 'viewer', password: 'secret' },
    { id: 4, name: 'Hery Rana', email: 'hery@ferme.mg', role: 'manager', password: 'secret' }
  ]
};

export const dataProvider: DataProvider = fakeRestProvider(db, true);