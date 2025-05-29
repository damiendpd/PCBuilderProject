export interface Component {
    _id?: string;
    category: string;
    brand: string;
    title: string;
    specs?: Record<string, string>;
    price: number;
    image?: string;
  }
  