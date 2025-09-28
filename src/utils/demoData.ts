import { Product } from '../types';

export function createDemoProducts(): Product[] {
  return [
    { 
      id: 'demo-1',
      slug: 'mini-joy-bear',
      name: 'Mini Joy Bear',
      category: 'Toys',
      price: 349.0,
      currency: 'INR',
      images: ['https://images.pexels.com/photos/1375849/pexels-photo-1375849.jpeg?auto=compress&cs=tinysrgb&w=500'],
      description: 'Handmade tiny bear with soft jelly stuffing. Perfect for cuddles and playtime.',
      stock_count: 12,
      units_sold: 24,
      total_revenue: 8376.0,
      created_at: '2025-09-01T12:00:00Z',
      rating: {
        avg: 4.6,
        count: 10,
        breakdown: { '5': 7, '4': 2, '3': 1, '2': 0, '1': 0 }
      },
      reviews: [
        {
          id: 'r1',
          name: 'Anita',
          rating: 5,
          text: 'So cute!! My daughter loves it.',
          created_at: '2025-09-20T10:00:00Z'
        },
        {
          id: 'r2',
          name: 'Raj',
          rating: 4,
          text: 'Great quality, very soft.',
          created_at: '2025-09-18T14:30:00Z'
        }
      ]
    },
    {
      id: 'demo-2',
      slug: 'rainbow-jelly-pack',
      name: 'Rainbow Jelly Pack',
      category: 'Jellies',
      price: 199.0,
      currency: 'INR',
      images: ['https://images.pexels.com/photos/3788363/pexels-photo-3788363.jpeg?auto=compress&cs=tinysrgb&w=500'],
      description: 'Colorful homemade jellies in 6 different flavors. Made with natural ingredients.',
      stock_count: 8,
      units_sold: 45,
      total_revenue: 8955.0,
      created_at: '2025-08-15T09:00:00Z',
      rating: {
        avg: 4.8,
        count: 15,
        breakdown: { '5': 12, '4': 2, '3': 1, '2': 0, '1': 0 }
      },
      reviews: [
        {
          id: 'r3',
          name: 'Priya',
          rating: 5,
          text: 'Amazing flavors! Kids absolutely love them.',
          created_at: '2025-09-15T11:00:00Z'
        }
      ]
    },
    {
      id: 'demo-3',
      slug: 'wooden-puzzle-elephant',
      name: 'Wooden Puzzle Elephant',
      category: 'Toys',
      price: 599.0,
      currency: 'INR',
      images: ['https://images.pexels.com/photos/298825/pexels-photo-298825.jpeg?auto=compress&cs=tinysrgb&w=500'],
      description: 'Handcrafted wooden puzzle elephant. Educational and fun for all ages.',
      stock_count: 5,
      units_sold: 18,
      total_revenue: 10782.0,
      created_at: '2025-07-20T15:30:00Z',
      rating: {
        avg: 4.4,
        count: 8,
        breakdown: { '5': 4, '4': 3, '3': 1, '2': 0, '1': 0 }
      },
      reviews: [
        {
          id: 'r4',
          name: 'Amit',
          rating: 5,
          text: 'Excellent craftsmanship, very detailed.',
          created_at: '2025-09-10T16:45:00Z'
        }
      ]
    },
    {
      id: 'demo-4',
      slug: 'strawberry-delight-jelly',
      name: 'Strawberry Delight Jelly',
      category: 'Jellies',
      price: 89.0,
      currency: 'INR',
      images: ['https://images.pexels.com/photos/1756062/pexels-photo-1756062.jpeg?auto=compress&cs=tinysrgb&w=500'],
      description: 'Premium strawberry jelly made with fresh strawberries. A sweet treat for everyone.',
      stock_count: 15,
      units_sold: 67,
      total_revenue: 5963.0,
      created_at: '2025-06-10T08:15:00Z',
      rating: {
        avg: 4.7,
        count: 22,
        breakdown: { '5': 16, '4': 4, '3': 2, '2': 0, '1': 0 }
      },
      reviews: [
        {
          id: 'r5',
          name: 'Sunita',
          rating: 5,
          text: 'Fresh strawberry taste! Simply delicious.',
          created_at: '2025-09-05T13:20:00Z'
        }
      ]
    }
  ];
}