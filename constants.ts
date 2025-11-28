import { Category, Item, User } from './types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Arjun Mehta',
  email: 'arjun.m@college.edu.in',
  avatar: 'https://picsum.photos/id/64/200/200',
  isVerified: true,
  rating: 4.8
};

export const MOCK_USERS: Record<string, User> = {
  'u1': CURRENT_USER,
  'u2': {
    id: 'u2',
    name: 'Sneha Reddy',
    email: 'sneha.r@college.edu.in',
    avatar: 'https://picsum.photos/id/65/200/200',
    isVerified: true,
    rating: 4.9
  },
  'u3': {
    id: 'u3',
    name: 'Rahul Verma',
    email: 'rahul.v@college.edu.in',
    avatar: 'https://picsum.photos/id/91/200/200',
    isVerified: false,
    rating: 4.2
  }
};

export const MOCK_ITEMS: Item[] = [
  {
    id: 'i1',
    ownerId: 'u2',
    title: 'Casio fx-991EX Scientific Calculator',
    description: 'Perfect condition, essential for Engineering exams. Comes with cover.',
    category: Category.ELECTRONICS,
    pricePerDay: 40,
    originalPrice: 1200,
    imageUrl: 'https://picsum.photos/id/1/400/300',
    isAvailable: true,
    location: 'Library Pickup Zone',
    condition: 'Like New'
  },
  {
    id: 'i2',
    ownerId: 'u3',
    title: 'Formal Black Shoes (Size 9)',
    description: 'Worn once for a presentation. Clean and polished. Great for interviews.',
    category: Category.CLOTHING,
    pricePerDay: 150,
    originalPrice: 2500,
    imageUrl: 'https://picsum.photos/id/21/400/300',
    isAvailable: true,
    location: 'Hostel H5 Main Gate',
    condition: 'Good'
  },
  {
    id: 'i3',
    ownerId: 'u2',
    title: 'Chemistry Lab Coat (Size M)',
    description: 'Standard white lab coat. Freshly washed.',
    category: Category.LAB_EQUIPMENT,
    pricePerDay: 30,
    originalPrice: 600,
    imageUrl: 'https://picsum.photos/id/30/400/300',
    isAvailable: true,
    location: 'Chemistry Dept Lobby',
    condition: 'Good'
  },
  {
    id: 'i4',
    ownerId: 'u3',
    title: 'Badminton Racket (Yonex)',
    description: 'Carbon fiber racket, lightweight. Good tension.',
    category: Category.SPORTS,
    pricePerDay: 80,
    originalPrice: 3000,
    imageUrl: 'https://picsum.photos/id/73/400/300',
    isAvailable: false,
    location: 'Sports Complex',
    condition: 'Fair'
  },
  {
    id: 'i5',
    ownerId: 'u2',
    title: 'Introduction to Algorithms (CLRS)',
    description: 'The bible of algorithms. Hardcover, 3rd Edition.',
    category: Category.BOOKS,
    pricePerDay: 50,
    originalPrice: 4500,
    imageUrl: 'https://picsum.photos/id/24/400/300',
    isAvailable: true,
    location: 'Main Canteen',
    condition: 'Good'
  }
];