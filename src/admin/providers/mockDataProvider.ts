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
  ]
};

export const dataProvider: DataProvider = fakeRestProvider(db, true);