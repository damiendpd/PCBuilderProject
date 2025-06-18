import type { Offer } from './Offer';
export interface Component {
  _id?: string;
  name: string;
  type: 'CPU' | 'GPU' | 'RAM' | 'Motherboard' | 'Storage' | 'PSU' | 'Case';
  brand: string;
  price: number;
  specs: Record<string, any>;
  offers: Offer[];
}
  