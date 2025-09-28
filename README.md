# Anand Greenwich - E-commerce Application

A beautiful, responsive e-commerce application for handmade toys and jellies with complete admin functionality and file-based storage.

## Features

### 🛍️ Public Features
- **Product Catalog**: Dynamic product listings with filtering, sorting, and search
- **Reviews & Ratings**: Customer reviews with photo uploads and rating system
- **Leaderboard**: Top 3 best-selling products (public view shows ranks only)
- **Contact System**: WhatsApp integration for customer inquiries
- **Responsive Design**: Mobile-first design with beautiful animations
- **Light/Dark Theme**: Toggle with localStorage persistence

### 🔧 Admin Features
- **Product Management**: Full CRUD operations for products
- **Sales Recording**: Track sales, update stock, and record revenue
- **Admin Dashboard**: Complete analytics and management interface
- **PIN Authentication**: Secure admin access with hashed PIN storage
- **Demo Mode**: Toggle sample data for testing

### 💾 Data Management
- **File-based Storage**: Single `anand_greenwich.bb` JSON file
- **Browser Storage**: File System API with IndexedDB fallback
- **Import/Export**: Easy backup and restore functionality
- **Safe Merging**: Conflict-free data merging on import

## Getting Started

### Development
```bash
npm install
npm run dev
```

### Build for Production
```bash
npm run build
npm run preview
```

## Admin Usage

### Setting up Admin Access
1. Navigate to the Admin section
2. Click "Set Admin PIN" on first visit
3. Choose a secure PIN (remember this!)
4. Login with your PIN to access admin features

### Managing Products
1. **Add Products**: Click "Add a new cutie"
2. **Edit Products**: Click the edit button in the product table
3. **Record Sales**: Use the shopping cart button to record sales
4. **Delete Products**: Use the trash button to remove products

### Demo Mode
- Toggle demo mode to populate with sample products
- Perfect for testing and demonstration
- Can be enabled/disabled via the floating button

## Data File Structure

The application uses a single JSON file (`anand_greenwich.bb`) with this structure:

```json
{
  "meta": {
    "brand": "Anand Greenwich",
    "generated_at": "2025-01-XX...",
    "version": "1.1"
  },
  "settings": {
    "theme": "light|dark",
    "admin_pin_hash": "hashed-pin",
    "demo_mode": false
  },
  "products": [...]
}
```

### Product Schema
```json
{
  "id": "unique-id",
  "name": "Product Name",
  "category": "Category",
  "price": 299.0,
  "currency": "INR",
  "description": "Product description",
  "images": ["base64-or-url"],
  "stock_count": 10,
  "units_sold": 5,
  "total_revenue": 1495.0,
  "created_at": "ISO-date",
  "rating": {
    "avg": 4.5,
    "count": 12,
    "breakdown": {"5": 8, "4": 3, "3": 1, "2": 0, "1": 0}
  },
  "reviews": [...]
}
```

## Storage Options

### File System Access API (Preferred)
- Direct file read/write to local filesystem
- Automatic when supported by browser
- Best for desktop browsers

### IndexedDB Fallback
- Browser database storage
- Automatic fallback when File System API unavailable
- Works in all modern browsers

### Manual Export/Import
- Download `.bb` files manually
- Upload files via file picker
- Universal compatibility

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: File System API + IndexedDB
- **Build Tool**: Vite

## Browser Compatibility

- **Chrome/Edge 86+**: Full File System API support
- **Firefox 90+**: IndexedDB fallback
- **Safari 14+**: IndexedDB fallback
- **Mobile browsers**: IndexedDB fallback

## Security Features

- PIN-based admin authentication
- SHA-256 password hashing with salt
- No external API dependencies
- Client-side data encryption for sensitive fields

## Performance Features

- Lazy loading images
- Intersection Observer animations
- Component code splitting
- Optimized bundle size
- Mobile-first responsive design

## Customization

### Branding
- Update `src/components/Hero.tsx` for brand information
- Modify colors in Tailwind config
- Replace logo and brand assets

### Contact Information
- Update WhatsApp number in contact components
- Modify email addresses
- Update business address and hours

### Product Categories
- Categories are dynamic based on products
- No hardcoded category restrictions
- Fully customizable per business needs

## Support

For questions about implementation or customization, refer to the inline code comments and component documentation.

## License

Private project for Anand Greenwich brand.