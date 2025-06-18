import type { Partner } from './Partner'; 

export interface Offer {
  _id?: string; 
  partner: Partner | string; 
  price: number;
  url: string;
}