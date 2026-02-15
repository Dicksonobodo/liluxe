<!-- # NOIR - Premium Fashion E-Commerce
## Phase 1: Foundation & Design System ✅

This phase establishes the visual foundation and reusable UI components for your fashion e-commerce platform.

---

## 🎨 Design System

### Color Palette (Black & White Premium)
- **Base**: `stone-50` (#fafaf9) - Main background
- **Cards/Surfaces**: White (#ffffff)
- **Text Primary**: `stone-900` (#1c1917)
- **Text Secondary**: `stone-600` (#57534e)
- **Borders**: `stone-200`, `stone-300`
- **Accent**: `stone-900` (Black for CTAs)

### Typography
- **Headings**: Playfair Display (Serif) - Elegant, editorial feel
- **Body/UI**: Inter (Sans-serif) - Clean, readable
- **Uppercase labels**: Tracking-wider for premium feel

### Spacing Philosophy
- Generous whitespace (breathing room)
- Consistent padding (px-4 mobile, px-6 desktop)
- Max container width: 1280px

---

## 📦 What's Included

### UI Components (`/src/components/ui/`)

1. **Button.jsx**
   - Variants: `primary`, `secondary`, `ghost`, `danger`
   - Sizes: `sm`, `md`, `lg`
   - Loading state support
   ```jsx
   <Button variant="primary" size="md" loading={false}>
     Add to Cart
   </Button>
   ```

2. **Input.jsx**
   - Clean border design
   - Label support (uppercase style)
   - Error state handling
   ```jsx
   <Input 
     label="Email Address" 
     error="Invalid email"
     type="email"
   />
   ```

3. **Modal.jsx**
   - Portal-based (renders outside DOM tree)
   - Backdrop blur effect
   - Smooth animations
   - Auto-locks body scroll
   ```jsx
   <Modal isOpen={true} onClose={() => {}} title="Order Confirmed">
     Your order has been placed!
   </Modal>
   ```

4. **Skeleton.jsx**
   - ProductCardSkeleton - for individual cards
   - ProductGridSkeleton - for grid layouts
   - Custom skeleton for any use case
   ```jsx
   <ProductGridSkeleton count={8} />
   ```

5. **Badge.jsx**
   - Order status badges
   - Variants: `confirmed`, `processing`, `shipped`, `delivered`
   ```jsx
   <Badge variant="confirmed">Confirmed</Badge>
   ```

6. **Toast.jsx** (Notification System)
   - Success, Error, Info types
   - Auto-dismiss after 4 seconds
   - Stacks multiple notifications
   ```jsx
   const toast = useToast();
   toast.success('Product added to cart!');
   toast.error('Something went wrong');
   ```

### Layout Components (`/src/components/layout/`)

1. **Header.jsx**
   - Sticky navigation
   - Desktop: Full menu with icons
   - Mobile: Hamburger menu
   - Cart & Wishlist badges with counts
   - User dropdown menu

2. **BottomNav.jsx**
   - Mobile-only floating navigation
   - Rounded corners (rounded-2xl)
   - 4 items: Home, Shop, Saved (Wishlist), Cart
   - Notification badges on Cart & Wishlist
   - Auto-hides on desktop

3. **Footer.jsx**
   - Newsletter signup
   - Quick links
   - Social media icons
   - Responsive grid

---

## 🚀 Installation & Setup

### 1. Copy Files to Your Project
```bash
# Copy index.css to your src folder
cp index.css src/

# Copy all components
cp -r src/components your-project/src/
```

### 2. Update Your Main App Entry

**src/main.jsx**
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Tailwind CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 3. Wrap Your App with ToastProvider

**src/App.jsx**
```jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './components/ui';
import { Header, Footer, BottomNav } from './components/layout';

function App() {
  // Mock data for demo
  const cartCount = 3;
  const wishlistCount = 5;

  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Header cartCount={cartCount} wishlistCount={wishlistCount} />
          
          <main className="flex-1">
            {/* Your pages will go here */}
            <div className="max-w-screen-xl mx-auto px-4 py-8">
              <h1 className="font-serif text-4xl font-semibold mb-4">
                Welcome to NOIR
              </h1>
              <p className="text-stone-600">
                Premium fashion e-commerce platform
              </p>
            </div>
          </main>
          
          <Footer />
          <BottomNav cartCount={cartCount} wishlistCount={wishlistCount} />
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
```

---

## 📱 Responsive Design

All components are mobile-first:

### Breakpoints
- Mobile: Default (< 768px)
- Tablet: `md:` (768px+)
- Desktop: `lg:` (1024px+)

### Key Mobile Features
- Bottom navigation (mobile only)
- Hamburger menu in header
- Stacked footer on mobile
- Touch-friendly button sizes (minimum 44px height)

---

## 🎯 Design Principles Applied

✅ **Minimalism**: No unnecessary decoration, clean lines
✅ **Typography Hierarchy**: Large serifs for headings, clean sans for body
✅ **Breathing Space**: Generous padding and margins
✅ **Professional Animations**: Subtle 200-300ms transitions
✅ **Accessibility**: Proper contrast ratios, focus states
✅ **Mobile-First**: Every component works perfectly on mobile

---

## 🧪 Testing Components

Create a test page to preview all components:

**src/pages/ComponentTest.jsx**
```jsx
import React, { useState } from 'react';
import { Button, Input, Modal, Badge, useToast } from '../components/ui';

function ComponentTest() {
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-12">
      {/* Buttons */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Buttons</h2>
        <div className="flex gap-4 flex-wrap">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Inputs</h2>
        <div className="space-y-4 max-w-md">
          <Input label="Email" type="email" />
          <Input label="Password" type="password" />
          <Input label="Error State" error="This field is required" />
        </div>
      </section>

      {/* Badges */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Badges</h2>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="confirmed">Confirmed</Badge>
          <Badge variant="processing">Processing</Badge>
          <Badge variant="shipped">Shipped</Badge>
          <Badge variant="delivered">Delivered</Badge>
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Modal</h2>
        <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Test Modal">
          <p>This is a modal content example.</p>
        </Modal>
      </section>

      {/* Toast */}
      <section>
        <h2 className="font-serif text-2xl mb-4">Toast Notifications</h2>
        <div className="flex gap-4">
          <Button onClick={() => toast.success('Success message!')}>
            Success Toast
          </Button>
          <Button onClick={() => toast.error('Error message!')}>
            Error Toast
          </Button>
          <Button onClick={() => toast.info('Info message!')}>
            Info Toast
          </Button>
        </div>
      </section>
    </div>
  );
}

export default ComponentTest;
```

---

## ✅ Phase 1 Checklist

- [x] Tailwind CSS v4 configuration
- [x] Premium black & white color system
- [x] Typography (Playfair Display + Inter)
- [x] Button component (4 variants, 3 sizes)
- [x] Input component with error states
- [x] Modal with portal & animations
- [x] Skeleton loaders
- [x] Badge component for statuses
- [x] Toast notification system
- [x] Header with cart notifications
- [x] Floating bottom navigation (mobile)
- [x] Footer with newsletter
- [x] Mobile-responsive design
- [x] Professional animations

---

## 📸 Preview

**Desktop Header**: Logo + Menu + Icons (Search, Wishlist, Cart with badges, User)
**Mobile Header**: Logo + Hamburger (menu slides down)
**Bottom Nav**: Floating bar with Home, Shop, Saved, Cart (rounded corners, badges)
**Typography**: Large serif headings, clean sans body text
**Buttons**: Sharp, minimal, black & white only
**Modals**: Clean, centered, backdrop blur

---

## 🎬 Next Steps (Phase 2)

Ready to move forward? In Phase 2 we'll set up:
- Firebase configuration
- Authentication (Google + Email/Password)
- Auth context and protected routes
- Firestore database structure
- Security rules

Let me know when you're ready! 🚀 -->