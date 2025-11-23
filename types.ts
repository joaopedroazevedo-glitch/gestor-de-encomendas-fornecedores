export interface Order {
  id: string;
  date: string;
  orderNumber: number;
  supplier: string;
  material: string;
  serviceDescription: string;
  customer: string;
  commercial: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Commercial {
  id: string;
  name: string;
}

export type SortField = 'date' | 'orderNumber' | 'supplier' | 'material' | 'customer' | 'commercial';
export type SortDirection = 'asc' | 'desc';