import { ID } from './products';

export interface User {
  id: ID;
  name: string;
  email: string;
  phone: string;
  savedPhoneModelId?: ID;
}

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Алихан',
  email: 'alihan@example.com',
  phone: '+7 777 000 0000',
  savedPhoneModelId: '1', // iPhone 15 Pro Max по умолчанию
};
