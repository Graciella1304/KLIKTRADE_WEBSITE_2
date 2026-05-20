import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'

const translations = {
  en: {
    lang: 'English',
    nav: {
      home: 'Home', browse: 'Browse', sell: 'Sell', wishlist: 'Wishlist', cart: 'Cart',
      signin: 'Sign In', signout: 'Sign Out', settings: 'Settings', dashboard: 'Dashboard',
      notifications: 'Notifications', allCategories: 'All Categories', becomeSeller: 'Become a Seller',
      sellOnKlikTrade: 'Sell on KlikTrade', postAd: 'Post an Ad',
    },
    auth: {
      login: 'Sign In', register: 'Create Account', email: 'Email', password: 'Password',
      name: 'Full Name', phone: 'Phone (MoMo)', nationalId: 'National ID Number',
      buyer: 'Buyer', seller: 'Seller', accountType: 'Account Type',
      welcomeBack: 'Welcome back!', joinKlikTrade: 'Join KlikTrade',
      loginSubtitle: 'Sign in to your KlikTrade account',
      registerSubtitle: 'Create your free account in seconds',
      alreadyMember: 'Already a member?', noAccount: "Don't have an account?",
      createAccount: 'Create my account', signIn: 'Sign In',
      nationalIdHint: 'Enter your 16-digit national ID',
      sellerNote: 'Seller accounts require admin approval before listing products.',
      buyerRole: 'I want to buy products', sellerRole: 'I want to sell products',
    },
    home: {
      heroTitle: 'Buy, Sell &', heroSpan: 'Trade in Rwanda',
      heroSub: 'Thousands of listings from individuals and professional sellers across Rwanda.',
      browseAds: 'Browse Listings', postAd: 'Post an Ad',
      browseByCategory: 'Shop by Category', findWhat: 'Explore our most popular departments',
      featured: 'Featured Listings', selectedForYou: 'Hand-picked for you',
      newListings: 'Latest Listings', freshlyPosted: 'Freshly posted',
      viewAll: 'View All', joinUs: 'Join KlikTrade Rwanda',
      joinDesc: 'Create a free account to save favorites, track orders and post your ads.',
      createAccount: 'Create Account',
      forSellers: 'For Sellers', startSelling: 'Start selling for free today',
      sellerDesc: 'Post your listings, reach thousands of buyers and grow your business across Rwanda.',
      forBuyers: 'For Buyers', startBuying: 'Find the best deals in Rwanda',
      buyerDesc: 'Browse thousands of verified listings, compare prices and buy securely with MTN MoMo.',
    },
    product: {
      addToCart: 'Add to Cart', buyNow: 'Buy Now', price: 'Price', condition: 'Condition',
      location: 'Location', category: 'Category', stock: 'In Stock', seller: 'Seller',
      description: 'Description', reviews: 'Reviews', writeReview: 'Write a Review',
      viewAll: 'View All Products', filter: 'Filters', sortBy: 'Sort by',
      newest: 'Newest', priceAsc: 'Price: Low to High', priceDesc: 'Price: High to Low',
      topRated: 'Top Rated', search: 'Search', featured: 'Featured only',
      noProducts: 'No products found', resetFilters: 'Reset Filters',
    },
    settings: {
      title: 'Settings', profile: 'Profile', security: 'Security',
      notifications: 'Notifications', account: 'Account',
      appearance: 'Appearance', language: 'Language',
      darkMode: 'Dark Mode', lightMode: 'Light Mode',
      languageSelect: 'Select Language', saveChanges: 'Save Changes',
      dangerZone: 'Danger Zone', signOut: 'Sign Out',
    },
    dashboard: {
      sellerDashboard: 'Seller Dashboard', buyerDashboard: 'Buyer Dashboard',
      myListings: 'My Listings', myOrders: 'My Orders', myFavorites: 'My Favorites',
      pendingApproval: 'Pending Admin Approval', requestSeller: 'Request Seller Access',
      sellerPending: 'Your seller request is pending admin approval.',
      totalSales: 'Total Sales', activeListings: 'Active Listings',
      addProduct: 'Add Product', requestDelete: 'Request Deletion',
      requestPriceChange: 'Request Price Change', priceChangePending: 'Price change pending',
    },
    admin: {
      dashboard: 'Dashboard', products: 'Products', orders: 'Orders',
      categories: 'Categories', users: 'Users', activities: 'Activities',
      sellerRequests: 'Seller Requests', priceRequests: 'Price Change Requests',
      deleteRequests: 'Delete Requests', approve: 'Approve', reject: 'Reject',
      pending: 'Pending', approved: 'Approved', rejected: 'Rejected',
    },
    general: {
      back: 'Back', submit: 'Submit', cancel: 'Cancel', save: 'Save',
      edit: 'Edit', delete: 'Delete', confirm: 'Confirm', close: 'Close',
      loading: 'Loading...', error: 'An error occurred', success: 'Success',
      currency: 'RWF', search: 'Search products...', filter: 'Filter', sortBy: 'Sort by',
      all: 'All', new: 'New', used: 'Used',
    },
    footer: {
      tagline: "Rwanda's #1 Marketplace", about: 'About', contact: 'Contact',
      terms: 'Terms of Use', privacy: 'Privacy Policy', help: 'Help Center',
      rights: 'All rights reserved.',
    },
  },
  fr: {
    lang: 'Français',
    nav: {
      home: 'Accueil', browse: 'Parcourir', sell: 'Vendre', wishlist: 'Favoris', cart: 'Panier',
      signin: 'Connexion', signout: 'Déconnexion', settings: 'Paramètres', dashboard: 'Tableau de bord',
      notifications: 'Notifications', allCategories: 'Toutes catégories', becomeSeller: 'Devenir vendeur',
      sellOnKlikTrade: 'Vendre sur KlikTrade', postAd: 'Publier une annonce',
    },
    auth: {
      login: 'Connexion', register: 'Créer un compte', email: 'Email', password: 'Mot de passe',
      name: 'Nom complet', phone: 'Téléphone (MoMo)', nationalId: "Numéro d'identité nationale",
      buyer: 'Acheteur', seller: 'Vendeur', accountType: 'Type de compte',
      welcomeBack: 'Bon retour !', joinKlikTrade: 'Rejoindre KlikTrade',
      loginSubtitle: 'Connectez-vous à votre compte KlikTrade',
      registerSubtitle: 'Créez votre compte gratuit en quelques secondes',
      alreadyMember: 'Déjà membre ?', noAccount: 'Pas encore de compte ?',
      createAccount: 'Créer mon compte', signIn: 'Se connecter',
      nationalIdHint: "Entrez votre numéro d'identité nationale à 16 chiffres",
      sellerNote: 'Les comptes vendeurs nécessitent une approbation admin avant de publier.',
      buyerRole: 'Je veux acheter des produits', sellerRole: 'Je veux vendre des produits',
    },
    home: {
      heroTitle: 'Achetez, Vendez &', heroSpan: 'Échangez au Rwanda',
      heroSub: 'Des milliers d\'annonces de particuliers et vendeurs professionnels à travers le Rwanda.',
      browseAds: 'Parcourir les annonces', postAd: 'Publier une annonce',
      browseByCategory: 'Acheter par catégorie', findWhat: 'Explorez nos départements populaires',
      featured: 'Annonces à la une', selectedForYou: 'Sélectionnés pour vous',
      newListings: 'Dernières annonces', freshlyPosted: 'Fraîchement publiées',
      viewAll: 'Tout voir', joinUs: 'Rejoignez KlikTrade Rwanda',
      joinDesc: 'Créez un compte gratuit pour sauvegarder vos favoris et publier vos annonces.',
      createAccount: 'Créer un compte',
      forSellers: 'Pour les Vendeurs', startSelling: 'Commencez à vendre gratuitement',
      sellerDesc: 'Publiez vos annonces, atteignez des milliers d\'acheteurs et développez votre activité.',
      forBuyers: 'Pour les Acheteurs', startBuying: 'Trouvez les meilleures offres au Rwanda',
      buyerDesc: 'Parcourez des milliers d\'annonces vérifiées et achetez en toute sécurité avec MTN MoMo.',
    },
    product: {
      addToCart: 'Ajouter au panier', buyNow: 'Acheter maintenant', price: 'Prix', condition: 'État',
      location: 'Localisation', category: 'Catégorie', stock: 'En stock', seller: 'Vendeur',
      description: 'Description', reviews: 'Avis', writeReview: 'Écrire un avis',
      viewAll: 'Voir tous les produits', filter: 'Filtres', sortBy: 'Trier par',
      newest: 'Plus récents', priceAsc: 'Prix croissant', priceDesc: 'Prix décroissant',
      topRated: 'Mieux notés', search: 'Rechercher', featured: 'En vedette seulement',
      noProducts: 'Aucune annonce trouvée', resetFilters: 'Réinitialiser les filtres',
    },
    settings: {
      title: 'Paramètres', profile: 'Profil', security: 'Sécurité',
      notifications: 'Notifications', account: 'Compte',
      appearance: 'Apparence', language: 'Langue',
      darkMode: 'Mode sombre', lightMode: 'Mode clair',
      languageSelect: 'Choisir la langue', saveChanges: 'Enregistrer',
      dangerZone: 'Zone dangereuse', signOut: 'Se déconnecter',
    },
    dashboard: {
      sellerDashboard: 'Tableau de bord vendeur', buyerDashboard: 'Tableau de bord acheteur',
      myListings: 'Mes annonces', myOrders: 'Mes commandes', myFavorites: 'Mes favoris',
      pendingApproval: "En attente d'approbation", requestSeller: 'Demander accès vendeur',
      sellerPending: "Votre demande vendeur est en attente d'approbation.",
      totalSales: 'Ventes totales', activeListings: 'Annonces actives',
      addProduct: 'Ajouter un produit', requestDelete: 'Demander suppression',
      requestPriceChange: 'Demander changement de prix', priceChangePending: 'Changement de prix en attente',
    },
    admin: {
      dashboard: 'Tableau de bord', products: 'Produits', orders: 'Commandes',
      categories: 'Catégories', users: 'Utilisateurs', activities: 'Activités',
      sellerRequests: 'Demandes vendeurs', priceRequests: 'Demandes de prix',
      deleteRequests: 'Demandes de suppression', approve: 'Approuver', reject: 'Rejeter',
      pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté',
    },
    general: {
      back: 'Retour', submit: 'Soumettre', cancel: 'Annuler', save: 'Enregistrer',
      edit: 'Modifier', delete: 'Supprimer', confirm: 'Confirmer', close: 'Fermer',
      loading: 'Chargement...', error: 'Une erreur est survenue', success: 'Succès',
      currency: 'RWF', search: 'Rechercher des produits...', filter: 'Filtrer', sortBy: 'Trier par',
      all: 'Tout', new: 'Neuf', used: 'Occasion',
    },
    footer: {
      tagline: 'Marketplace N°1 au Rwanda', about: 'À propos', contact: 'Contact',
      terms: "Conditions d'utilisation", privacy: 'Politique de confidentialité', help: 'Aide',
      rights: 'Tous droits réservés.',
    },
  },
  rw: {
    lang: 'Kinyarwanda',
    nav: {
      home: 'Ahabanza', browse: 'Shakisha', sell: 'Gurisha', wishlist: 'Ibyangwa', cart: 'Agashaho',
      signin: 'Injira', signout: 'Sohoka', settings: 'Igenamiterere', dashboard: 'Ikibaho',
      notifications: 'Amakuru', allCategories: 'Ibyiciro byose', becomeSeller: 'Guhinduka Ugucuruza',
      sellOnKlikTrade: 'Gurisha kuri KlikTrade', postAd: 'Tangaza Ibicuruzwa',
    },
    auth: {
      login: 'Injira', register: 'Iyandikishe', email: 'Imeli', password: "Ijambo ry'ibanga",
      name: 'Amazina yuzuye', phone: 'Nimero ya telefoni', nationalId: 'Indangamuntu',
      buyer: 'Ugura', seller: 'Ugucuruza', accountType: "Ubwoko bw'konti",
      welcomeBack: 'Murakaza neza!', joinKlikTrade: 'Injira muri KlikTrade',
      loginSubtitle: 'Injira muri konti yawe ya KlikTrade',
      registerSubtitle: 'Fungura konti yawe ubuntu mu masegonda make',
      alreadyMember: 'Usanzwe ufite konti?', noAccount: 'Nta konti ufite?',
      createAccount: 'Fungura konti yanjye', signIn: 'Injira',
      nationalIdHint: "Injiza nimero y'indangamuntu y'imibare 16",
      sellerNote: "Konti z'abacuruzi zikenera kwemezwa n'umuyobozi mbere yo gutangaza.",
      buyerRole: 'Ndashaka kugura ibicuruzwa', sellerRole: 'Ndashaka kugurisha ibicuruzwa',
    },
    home: {
      heroTitle: 'Gura, Gurisha &', heroSpan: 'Gucuruza mu Rwanda',
      heroSub: "Ibihumbi by'amatangazo atuye n'abacuruzi b'inzobere mu Rwanda hose.",
      browseAds: 'Reba Amatangazo', postAd: 'Tangaza Ibicuruzwa',
      browseByCategory: 'Gura mu byiciro', findWhat: 'Shakisha ibyo ushaka',
      featured: 'Amatangazo Yihariye', selectedForYou: 'Yahiswemo kukurusha',
      newListings: 'Amatangazo Mashya', freshlyPosted: 'Yatangajwe vuba',
      viewAll: 'Reba Byose', joinUs: 'Injira muri KlikTrade Rwanda',
      joinDesc: 'Fungura konti ubuntu kugira ngo ubike ibyangwa no gutangaza amatangazo yawe.',
      createAccount: 'Fungura Konti',
      forSellers: "Ku Bagurisha", startSelling: 'Tangira kugurisha ubuntu uyu munsi',
      sellerDesc: "Tangaza ibicuruzwa byawe, ugere ku baguzi ibihumbi no gukuza ubucuruzi bwawe mu Rwanda.",
      forBuyers: 'Ku Bagura', startBuying: 'Shakisha ibyiza byinshi mu Rwanda',
      buyerDesc: "Reba ibihumbi by'amatangazo yemejwe kandi ugure mu mutekano ukoresheje MTN MoMo.",
    },
    product: {
      addToCart: 'Ongeramo mu Gashaho', buyNow: 'Gura Nonaha', price: 'Igiciro', condition: 'Uko kimeze',
      location: 'Ahantu', category: 'Icyiciro', stock: 'Bihari', seller: 'Ugurisha',
      description: 'Ibisobanuro', reviews: 'Ibitekerezo', writeReview: 'Andika Igitekerezo',
      viewAll: 'Reba Ibicuruzwa Byose', filter: 'Shungura', sortBy: 'Teganya na',
      newest: 'Vuba', priceAsc: 'Igiciro: Gito kugeza Kinini', priceDesc: 'Igiciro: Kinini kugeza Gito',
      topRated: 'Byahawe Amanota Menshi', search: 'Shakisha', featured: 'Ibikomeye gusa',
      noProducts: 'Nta bicuruzwa bibonetse', resetFilters: 'Subiramo Gushungura',
    },
    settings: {
      title: 'Igenamiterere', profile: 'Umwirondoro', security: 'Umutekano',
      notifications: 'Amakuru', account: 'Konti', appearance: 'Isura', language: 'Ururimi',
      darkMode: 'Umwijima', lightMode: 'Urumuri',
      languageSelect: 'Hitamo Ururimi', saveChanges: 'Bika Impinduka',
      dangerZone: 'Ahantu Hateye Ubwoba', signOut: 'Sohoka',
    },
    dashboard: {
      sellerDashboard: "Ikibaho cy'Ugucuruza", buyerDashboard: "Ikibaho cy'Ugura",
      myListings: 'Amatangazo Yanjye', myOrders: 'Amaburizwa Yanjye', myFavorites: 'Ibyangwa Byanjye',
      pendingApproval: 'Birindiriye Kwemezwa', requestSeller: 'Saba Uburenganira bwo Gucuruza',
      sellerPending: "Isaba ryawe ryo gucuruza ririndiriye kwemezwa n'umuyobozi.",
      totalSales: 'Ibyagurishijwe Byose', activeListings: 'Amatangazo Akora',
      addProduct: 'Ongeramo Igicuruzwa', requestDelete: 'Saba Gusiba',
      requestPriceChange: 'Saba Guhindura Igiciro', priceChangePending: 'Guhindura igiciro birindiriye',
    },
    admin: {
      dashboard: 'Ikibaho', products: 'Ibicuruzwa', orders: 'Amaburizwa',
      categories: 'Ibyiciro', users: 'Abakoresha', activities: 'Ibikorwa',
      sellerRequests: "Amasaba y'Abacuruzi", priceRequests: "Amasaba y'Igiciro",
      deleteRequests: 'Amasaba yo Gusiba', approve: 'Emera', reject: 'Tanga',
      pending: 'Birindiriye', approved: 'Byemejwe', rejected: 'Byanzwe',
    },
    general: {
      back: 'Garuka', submit: 'Ohereza', cancel: 'Hagarika', save: 'Bika',
      edit: 'Hindura', delete: 'Siba', confirm: 'Emeza', close: 'Funga',
      loading: 'Gutegereza...', error: 'Habaye ikosa', success: 'Byagenze neza',
      currency: 'RWF', search: 'Shakisha ibicuruzwa...', filter: 'Shungura', sortBy: 'Teganya na',
      all: 'Byose', new: 'Bishya', used: 'Byakoreshejwe',
    },
    footer: {
      tagline: 'Isoko Nkuru mu Rwanda', about: 'Ibyacu', contact: 'Twandikire',
      terms: 'Amabwiriza', privacy: 'Ibanga', help: 'Ubufasha',
      rights: 'Uburenganzira bwose burasigiwe.',
    },
  },
}

function deepAssign(target, source) {
  Object.keys(source).forEach(key => {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {}
      deepAssign(target[key], source[key])
    } else {
      target[key] = source[key]
    }
  })
}

export const useI18nStore = defineStore('i18n', () => {
  const lang = ref(localStorage.getItem('kt_lang') || 'en')

  // t is reactive — components can safely destructure it and reactivity is preserved
  const t = reactive({})
  deepAssign(t, translations[lang.value] || translations.en)

function setLang(l) {
  if (translations[l]) {
    lang.value = l
    localStorage.setItem('kt_lang', l)
    // Clear existing keys first, then assign
    Object.keys(t).forEach(key => delete t[key])
    deepAssign(t, translations[l])
  }
}

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'rw', name: 'Kinyarwanda', flag: '🇷🇼' },
  ]

  return { lang, t, setLang, availableLanguages }
})
