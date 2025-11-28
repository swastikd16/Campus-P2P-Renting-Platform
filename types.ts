export enum Category {
  ELECTRONICS = 'Electronics',
  BOOKS = 'Books',
  CLOTHING = 'Clothing & Shoes',
  SPORTS = 'Sports & Fitness',
  LAB_EQUIPMENT = 'Lab Equipment',
  OTHERS = 'Others'
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isVerified: boolean;
  rating: number;
}

export interface Item {
  id: string;
  ownerId: string;
  title: string;
  description: string;
  category: Category;
  pricePerDay: number;
  originalPrice: number;
  imageUrl: string;
  isAvailable: boolean;
  location: string; // e.g., "Hostel H4", "Library"
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
}

export interface Transaction {
  id: string;
  itemId: string;
  borrowerId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'DISPUTED';
}

export interface AIAnalysisResult {
  suggestedPrice?: number;
  suggestedDescription?: string;
  marketDemand?: string;
  safetyTips?: string[];
}
