# KlikTrade Shop — Rwanda Peer-to-Peer Marketplace

## Stack
- **Frontend**: Vue.js 3 + Vite + Pinia + Vue Router + Axios
- **Backend**: Express.js + nedb-promises (100% JavaScript, no Python / node-gyp!)
- **Auth**: JWT (bcryptjs)
- **Currency**: RWF (Rwandan Francs)
- **Uploads**: Multer (local disk storage)

## Quick Start

### 1. Backend
```bash
cd backend
npm install
npm run dev        # runs on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev        # runs on http://localhost:3000
```

## Admin Credentials
- **Email**: kliktradeshop@gmail.com  
- **Password**: cortis2005  
- **Admin Panel**: http://localhost:3000/admin  

## Routes (Frontend)
| Path | Page |
|------|------|
| `/` | Accueil |
| `/listing` | Tous les produits |
| `/products/:id` | Détail produit |
| `/cart` | Panier |
| `/checkout` | Paiement |
| `/signin` | Connexion / Inscription |
| `/wishlist` | Liste de souhaits |
| `/become-seller` | Devenir vendeur |
| `/sell` | Publier un produit |
| `/notifications` | Notifications |
| `/settings` | Paramètres |
| `/admin` | Admin login |
| `/admin/dashboard` | Tableau de bord |
| `/admin/products` | Gestion produits |
| `/admin/orders` | Gestion commandes |
| `/admin/categories` | Gestion catégories |
| `/admin/users` | Gestion utilisateurs |

## API Endpoints
- `POST /api/auth/register` — Register user
- `POST /api/auth/user-login` — User login
- `POST /api/auth/login` — Admin login
- `GET /api/auth/profile` — Current user (auth required)
- `GET /api/auth/users` — All users (admin)
- `GET /api/products` — List products (?search=&categoryId=&page=&limit=)
- `GET /api/products/:id` — Product detail
- `POST /api/products` — Create product (auth)
- `PUT /api/products/:id` — Update product (auth)
- `DELETE /api/products/:id` — Delete product (auth)
- `GET /api/categories` — List categories
- `POST /api/categories` — Create category (admin)
- `GET /api/orders` — List orders (auth)
- `POST /api/orders` — Create order (auth)
- `PUT /api/orders/:id` — Update order status (admin)
- `GET /api/wishlist` — Get wishlist (auth)
- `POST /api/wishlist` — Add to wishlist (auth)
- `DELETE /api/wishlist/:id` — Remove from wishlist (auth)

## Notes
- DB files auto-created in `backend/data/` on first run (nedb — no installation needed!)
- Delete `backend/data/*.db` to reset and re-seed with sample Rwandan products
- All prices in RWF (integer), displayed with `toLocaleString('fr-RW')`
- Designed to match kliktradeshop.lovable.app + klik-trade-shop.base44.app/admin/dashboard
