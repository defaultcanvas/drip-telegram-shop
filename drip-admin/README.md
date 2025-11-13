# Drip Admin Panel

A premium admin panel for managing the Drip Telegram Shop.

## Features

- 🎨 **Premium UI Design** - Glass morphism effects, gradients, and smooth animations
- 🌓 **Dark/Light Theme** - Seamless theme switching with system preference detection
- 📦 **Product Management** - Full CRUD operations for products with image upload
- 📋 **Order Management** - View and track customer orders with detailed information
- 🖼️ **Image Upload** - Direct Supabase Storage integration with drag & drop
- 📱 **Responsive Design** - Mobile-first design that works on all devices
- ⚡ **Fast Performance** - Built with Next.js 14 for optimal performance

## Technology Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS with custom glass morphism components
- **Animations**: Framer Motion for smooth transitions and micro-interactions
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage for image uploads
- **Icons**: Lucide React
- **Theme**: Custom theme system with dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Navigate to the admin directory:
```bash
cd drip-admin
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) to view the admin panel.

## Project Structure

```
drip-admin/
├── src/
│   ├── app/                 # Next.js 14 App Router
│   │   ├── admin/           # Admin dashboard pages
│   │   │   ├── products/    # Products management
│   │   │   └── orders/      # Orders management
│   │   ├── upload-test/     # Image upload testing
│   │   ├── globals.css      # Global styles with Tailwind
│   │   └── layout.js        # Root layout with theme provider
│   ├── components/          # Reusable React components
│   │   ├── AdminHeader.jsx  # Navigation header
│   │   ├── ProductForm.jsx  # Product creation/editing form
│   │   ├── ProductCard.jsx  # Product display card
│   │   └── ThemeToggle.jsx  # Dark/light mode toggle
│   └── lib/                 # Utility libraries
│       ├── supabase.js      # Database and storage functions
│       └── theme.js         # Theme context provider
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
└── next.config.js           # Next.js configuration
```

## Key Features

### Admin Dashboard
- **Statistics Overview**: Total products, orders, revenue, and categories
- **Real-time Data**: Live updates from Supabase database
- **Quick Actions**: Add products, view orders, manage inventory

### Product Management
- **CRUD Operations**: Create, read, update, delete products
- **Image Upload**: Drag & drop image upload with preview
- **Category Management**: Organize products by categories
- **Search & Filter**: Find products quickly with advanced filtering
- **Grid/List Views**: Toggle between different display modes

### Order Management
- **Order Tracking**: View all customer orders with status updates
- **Order Details**: Detailed view of items, customer info, and delivery address
- **Status Management**: Track order progression from pending to completed
- **Customer Information**: Access customer contact details and preferences

### Image Upload System
- **Supabase Integration**: Direct upload to Supabase Storage
- **Drag & Drop**: Intuitive file selection with visual feedback
- **Preview System**: Instant image preview before upload
- **Error Handling**: Comprehensive error reporting and recovery

### Theme System
- **Dark/Light Mode**: Toggle between themes with smooth transitions
- **System Detection**: Automatically detect user's system preference
- **Persistent Storage**: Remember user's theme choice across sessions
- **Glass Effects**: Premium glass morphism design elements

## Database Schema

The admin panel works with the following Supabase tables:

```sql
-- Products table
CREATE TABLE products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table  
CREATE TABLE orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  items JSONB NOT NULL,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  delivery_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Drip Telegram Shop system.
