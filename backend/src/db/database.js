const Datastore = require('nedb-promises')
const bcrypt = require('bcryptjs')
const path = require('path')

const dataDir = path.join(__dirname, '../../data')

const db = {
  users: Datastore.create({ filename: path.join(dataDir, 'users.db'), autoload: true }),
  categories: Datastore.create({ filename: path.join(dataDir, 'categories.db'), autoload: true }),
  products: Datastore.create({ filename: path.join(dataDir, 'products.db'), autoload: true }),
  orders: Datastore.create({ filename: path.join(dataDir, 'orders.db'), autoload: true }),
  reviews: Datastore.create({ filename: path.join(dataDir, 'reviews.db'), autoload: true }),
  wishlists: Datastore.create({ filename: path.join(dataDir, 'wishlists.db'), autoload: true }),
  activities: Datastore.create({ filename: path.join(dataDir, 'activities.db'), autoload: true }),
  sellerRequests: Datastore.create({ filename: path.join(dataDir, 'sellerRequests.db'), autoload: true }),
  priceRequests: Datastore.create({ filename: path.join(dataDir, 'priceRequests.db'), autoload: true }),
  deleteRequests: Datastore.create({ filename: path.join(dataDir, 'deleteRequests.db'), autoload: true }),
}

async function logActivity(type, description, userId = null, meta = {}) {
  try {
    await db.activities.insert({ type, description, userId, meta, createdAt: new Date() })
  } catch (e) { console.error('Activity log error:', e) }
}

// Full category list with real Unsplash photography IDs
const allCategories = [
  { name: 'Electronics', slug: 'electronics', icon: 'fa-mobile-alt', image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500&q=80' },
  { name: 'Fashion', slug: 'fashion', icon: 'fa-tshirt', image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80' },
  { name: 'Home & Kitchen', slug: 'home-kitchen', icon: 'fa-home', image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=80' },
  { name: 'Vehicles', slug: 'vehicles', icon: 'fa-car', image: 'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80' },
  { name: 'Agriculture', slug: 'agriculture', icon: 'fa-seedling', image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=500&q=80' },
  { name: 'Sports', slug: 'sports', icon: 'fa-futbol', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=500&q=80' },
  { name: 'Beauty', slug: 'beauty', icon: 'fa-spa', image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=500&q=80' },
  { name: 'Books', slug: 'books', icon: 'fa-book', image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&q=80' },
  { name: 'Real Estate', slug: 'real-estate', icon: 'fa-building', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500&q=80' },
  { name: 'Food & Groceries', slug: 'food-groceries', icon: 'fa-shopping-basket', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&q=80' },
  { name: 'Construction', slug: 'construction', icon: 'fa-hard-hat', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=500&q=80' },
  { name: 'Baby & Kids', slug: 'baby-kids', icon: 'fa-baby', image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&q=80' },
  { name: 'Health', slug: 'health', icon: 'fa-heartbeat', image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=500&q=80' },
  { name: 'Phones', slug: 'phones', icon: 'fa-phone', image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=500&q=80' },
  { name: 'Computers', slug: 'computers', icon: 'fa-laptop', image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500&q=80' },
  { name: 'Services', slug: 'services', icon: 'fa-concierge-bell', image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=500&q=80' },
]

async function seedDB() {
  const userCount = await db.users.count({})
  if (userCount === 0) {
    const adminHash = bcrypt.hashSync('cortis2005', 10)
    const userHash = bcrypt.hashSync('password123', 10)
    await db.users.insert([
      { email: 'kliktradeshop@gmail.com', password: adminHash, role: 'admin', name: 'KlikTrade Admin', phone: '+250 788 000 000', avatar: '', nationalId: 'ADMIN-001', sellerStatus: 'approved', createdAt: new Date() },
      { email: 'alice@example.com', password: userHash, role: 'seller', name: 'Alice Uwimana', phone: '+250 788 123 456', avatar: '', nationalId: '1199880012345678', sellerStatus: 'approved', createdAt: new Date() },
      { email: 'bob@example.com', password: userHash, role: 'buyer', name: 'Bob Nkurunziza', phone: '+250 722 987 654', avatar: '', nationalId: '1199980087654321', sellerStatus: null, createdAt: new Date() },
    ])
  }

  // Upsert categories — add any missing ones without deleting existing data
  for (const cat of allCategories) {
    const exists = await db.categories.findOne({ slug: cat.slug })
    if (!exists) {
      await db.categories.insert({ ...cat, createdAt: new Date() })
    } else {
      // Update image and icon in case they changed
      await db.categories.update({ slug: cat.slug }, { $set: { image: cat.image, icon: cat.icon, name: cat.name } })
    }
  }

  const prodCount = await db.products.count({})
  if (prodCount === 0) {
    const cats = await db.categories.find({})
    const catMap = {}
    cats.forEach(c => { catMap[c.slug] = c._id })
    const alice = await db.users.findOne({ email: 'alice@example.com' })
    const bob = await db.users.findOne({ email: 'bob@example.com' })

    await db.products.insert([
      { name: 'Samsung Galaxy A54', description: 'Smartphone 6.4", 128GB, Double SIM, batterie 5000mAh. Excellent état, peu utilisé.', price: 450000, originalPrice: 580000, stock: 10, categoryId: catMap['electronics'], categoryName: 'Electronics', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500', featured: true, rating: 4.7, reviewsCount: 34, condition: 'Used', location: 'Kigali', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'iPhone 14 Pro', description: 'iPhone 14 Pro 256GB couleur Space Black. Débloqué tout opérateur. Accessoires inclus.', price: 1200000, originalPrice: 1500000, stock: 5, categoryId: catMap['electronics'], categoryName: 'Electronics', image: 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=500', featured: true, rating: 4.9, reviewsCount: 89, condition: 'Like New', location: 'Kigali', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'Dell Laptop Core i5', description: 'Dell Latitude Core i5, 8GB RAM, 256GB SSD. Parfait pour le bureau ou les études.', price: 750000, originalPrice: 950000, stock: 8, categoryId: catMap['computers'], categoryName: 'Computers', image: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500', featured: true, rating: 4.5, reviewsCount: 21, condition: 'Used', location: 'Musanze', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'African Print Dress', description: 'Belle robe africaine faite à la main. Tissu kitenge de haute qualité. Disponible en plusieurs tailles.', price: 35000, originalPrice: 50000, stock: 25, categoryId: catMap['fashion'], categoryName: 'Fashion', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', featured: true, rating: 4.8, reviewsCount: 67, condition: 'New', location: 'Kigali', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'Leather Shoes Men', description: 'Chaussures en cuir véritable artisanales. Confortables et élégantes pour toutes occasions.', price: 45000, originalPrice: 65000, stock: 15, categoryId: catMap['fashion'], categoryName: 'Fashion', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500', featured: false, rating: 4.3, reviewsCount: 28, condition: 'New', location: 'Kigali', sellerName: 'Bob Nkurunziza', sellerId: bob?._id, status: 'active', createdAt: new Date() },
      { name: 'Singer Sewing Machine', description: 'Machine à coudre Singer électrique. Parfaite pour couturières et artisans.', price: 180000, originalPrice: 250000, stock: 3, categoryId: catMap['home-kitchen'], categoryName: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500', featured: true, rating: 4.6, reviewsCount: 45, condition: 'Used', location: 'Huye', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: '3-Seat Sofa', description: 'Canapé 3 places en tissu beige, très confortable. En excellent état.', price: 280000, originalPrice: 400000, stock: 2, categoryId: catMap['home-kitchen'], categoryName: 'Home & Kitchen', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500', featured: false, rating: 4.4, reviewsCount: 12, condition: 'Used', location: 'Kigali', sellerName: 'Bob Nkurunziza', sellerId: bob?._id, status: 'active', createdAt: new Date() },
      { name: 'Mountain Bike 26"', description: 'VTT 26 pouces avec 21 vitesses. Freins à disque, cadre aluminium léger.', price: 120000, originalPrice: 180000, stock: 6, categoryId: catMap['sports'], categoryName: 'Sports', image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=500', featured: false, rating: 4.5, reviewsCount: 19, condition: 'Used', location: 'Musanze', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'Face Moisturizer Cream', description: 'Crème hydratante naturelle pour peaux africaines. Formule enrichie en beurre de karité.', price: 12000, originalPrice: 18000, stock: 50, categoryId: catMap['beauty'], categoryName: 'Beauty', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500', featured: true, rating: 4.7, reviewsCount: 156, condition: 'New', location: 'Kigali', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'Honda CB125 Motorbike', description: 'Honda CB125 2021 en parfait état. Faible kilométrage, documents complets.', price: 2800000, originalPrice: 3500000, stock: 1, categoryId: catMap['vehicles'], categoryName: 'Vehicles', image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=500', featured: true, rating: 4.8, reviewsCount: 8, condition: 'Used', location: 'Kigali', sellerName: 'Alice Uwimana', sellerId: alice?._id, status: 'active', createdAt: new Date() },
      { name: 'Red Beans 50kg Bag', description: 'Haricots rouges locaux frais récolte 2024. Prix par sac de 50kg.', price: 65000, originalPrice: 80000, stock: 100, categoryId: catMap['agriculture'], categoryName: 'Agriculture', image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500', featured: false, rating: 4.6, reviewsCount: 34, condition: 'New', location: 'Ruhango', sellerName: 'Bob Nkurunziza', sellerId: bob?._id, status: 'active', createdAt: new Date() },
      { name: '3-Bedroom House Kigali', description: 'Belle maison 3 chambres à Kicukiro. Sécurisée, proche des commodités.', price: 85000000, originalPrice: null, stock: 1, categoryId: catMap['real-estate'], categoryName: 'Real Estate', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500', featured: true, rating: 4.9, reviewsCount: 5, condition: 'New', location: 'Kigali', sellerName: 'Bob Nkurunziza', sellerId: bob?._id, status: 'active', createdAt: new Date() },
    ])
  }

  const orderCount = await db.orders.count({})
  if (orderCount === 0) {
    const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled']
    const sampleOrders = []
    for (let i = 1; i <= 15; i++) {
      sampleOrders.push({
        orderNumber: `KT-${String(1000 + i).padStart(4, '0')}`,
        customerName: `Acheteur ${i}`,
        customerEmail: `buyer${i}@example.com`,
        customerPhone: `+250 78${i} 000 000`,
        address: `KG ${i * 5} Ave`,
        city: ['Kigali', 'Huye', 'Musanze', 'Rubavu', 'Ruhango'][i % 5],
        items: [{ name: 'Produit exemple', qty: (i % 3) + 1, price: (i * 15000) }],
        total: (i * 15000) * ((i % 3) + 1),
        status: statuses[i % 5],
        paymentMethod: ['momo', 'cash', 'card'][i % 3],
        notes: '',
        createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      })
    }
    await db.orders.insert(sampleOrders)
  }

  const actCount = await db.activities.count({})
  if (actCount === 0) {
    const types = ['user_register', 'user_login', 'order_placed', 'product_listed', 'seller_request']
    const descs = ['New user registered', 'User signed in', 'New order placed', 'Product listed', 'Seller request submitted']
    const sampleActs = []
    for (let i = 0; i < 30; i++) {
      const t = types[i % types.length]
      sampleActs.push({ type: t, description: descs[i % descs.length], userId: null, meta: {}, createdAt: new Date(Date.now() - i * 3 * 60 * 60 * 1000) })
    }
    await db.activities.insert(sampleActs)
  }
}

module.exports = { db, logActivity, seedDB }
