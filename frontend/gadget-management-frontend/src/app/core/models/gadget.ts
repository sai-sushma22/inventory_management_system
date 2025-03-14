export interface Gadget {
    id?: number;
    name: string;
    description: string;
    price: number;
    quantity: number;
    category?: string | null;
    brand?: string | null;
    image_url?: string;
    created_at?: string;
  }