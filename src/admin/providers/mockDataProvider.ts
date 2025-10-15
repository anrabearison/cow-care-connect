import fakeRestProvider from 'ra-data-fakerest';
import type { DataProvider } from 'react-admin';
import { mockCattleData } from '@/data/mockData';

const db = {
  cattle: mockCattleData,
  users: [
    { id: 1, name: 'Jean Rakoto', email: 'admin@ferme.mg', role: 'admin', password: 'admin123' },
    { id: 2, name: 'Livia Raso', email: 'livia@ferme.mg', role: 'manager', password: 'secret' },
    { id: 3, name: 'Tiana Andry', email: 'tiana@ferme.mg', role: 'viewer', password: 'secret' },
    { id: 4, name: 'Hery Rana', email: 'hery@ferme.mg', role: 'manager', password: 'secret' }
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
  ]
};

export const dataProvider: DataProvider = fakeRestProvider(db, true);