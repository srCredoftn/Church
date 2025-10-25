# IMPLEMENTATION PLAN: Vatican News Theme → Multi-Parish CMS
## Archidiocèse de Cotonou - Local Development with MongoDB Community

**Version:** 1.0  
**Date:** October 2025  
**Environment:** Local (Node.js + MongoDB Community) → Production (Express API + Fallback)

---

## PHASE 1: PROJECT ARCHITECTURE & SETUP

### 1.A: Technology Stack

```
Frontend:  HTML/CSS/JS (current Vatican News theme)
Backend:   Node.js + Express.js
Database:  MongoDB Community (local development)
Cache:     JSON static files (fallback mechanism)
```

### 1.B: Project Structure

```
cotonou-cms/
├── server/
│   ├── index.js                 # Express app entry point
│   ├── config/
│   │   ├── db.js               # MongoDB connection
│   │   ├── constants.js         # Site-wide constants
│   │   └── fallback.js          # Static fallback config
│   ├── models/
│   │   ├── Admin.js             # Admin user model
│   │   ├── Parish.js            # Parish data model
│   │   ├── Article.js           # Article model
│   │   ├── Event.js             # Event model
│   │   ├── Page.js              # Static pages (Pape, Vatican, etc.)
│   │   └── MenuItem.js          # Navigation menu items
│   ├── routes/
│   │   ├── auth.js              # Login/admin routes
│   │   ├── api.js               # Public API routes
│   │   ├── pages.js             # /api/pages/* routes
│   │   ├── articles.js          # /api/articles/* routes
│   │   ├── events.js            # /api/events/* routes
│   │   └── admin.js             # Admin panel routes
│   ├── middleware/
│   │   ├── auth.js              # JWT/session auth
│   │   ├── errorHandler.js      # Global error handling
│   │   └── fallbackHandler.js   # Static file fallback
│   ├── controllers/
│   │   ├── pageController.js    # Page logic
│   │   ├── articleController.js # Article logic
│   │   ├── adminController.js   # Admin logic
│   │   └── authController.js    # Auth logic
│   ├── utils/
│   │   ├── cache.js             # Cache management
│   │   ├── logger.js            # Logging utility
│   │   └── validators.js        # Data validation
│   └── fallback/                # Static fallback files
│       ├── pages/               # Cached HTML pages
│       └── api/                 # Cached JSON responses
├── public/
│   ├── html/                    # Current Vatican News HTML theme
│   │   ├── fr.html              # Main page (updated with routes)
│   │   ├── fr/
│   │   │   ├── pape.html
│   │   │   ├── vatican.html
│   │   │   ├── eglise.html
│   │   │   └── monde.html
│   │   └── etc/designs/         # CSS, JS, images (unchanged)
│   ├── css/                     # Custom admin styles
│   ├── js/                      # Client-side scripts
│   └── assets/                  # Images, icons
├── admin-panel/                 # Admin UI
│   ├── index.html               # Admin dashboard
│   ├── pages.html               # Page editor
│   ├── articles.html            # Article manager
│   ├── events.html              # Event manager
│   ├── parishes.html            # Parish manager (multi-parish)
│   ├── users.html               # User manager
│   └── css/
├── seeds/
│   ├── seed-admin.js            # Seed first admin user
│   └── seed-data.js             # Sample data
├── .env.local                   # Local environment variables
├── .env.production              # Production env vars
├── package.json
├── server.js                    # App launcher
└── README.md
```

### 1.C: Environment Configuration

**File: `.env.local`**
```
NODE_ENV=development
PORT=3000
MONGO_URI=mongodb://localhost:27017/cotonou-cms
JWT_SECRET=your-local-secret-key
ADMIN_EMAIL=admin@cotonou.local
FALLBACK_MODE=true
FALLBACK_CACHE_DIR=./server/fallback
```

---

## PHASE 2: DATABASE SETUP

### 2.A: MongoDB Community Installation

1. **Install MongoDB Community** (macOS/Linux/Windows)
   ```bash
   # macOS (Homebrew)
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb-community
   
   # Linux (Ubuntu)
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | apt-key add -
   apt-get install -y mongodb-org
   systemctl start mongod
   
   # Windows: Download from mongodb.com/try/download/community
   ```

2. **Verify MongoDB is running**
   ```bash
   mongo --version
   mongosh localhost:27017/cotonou-cms
   ```

### 2.B: Database Schema & Collections

**Collection: `admins`**
```json
{
  "_id": ObjectId,
  "name": "Luc Admin",
  "email": "admin@cotonou.local",
  "password": "hashed_password_bcrypt",
  "role": "super_admin",
  "parishes": [ObjectId],  // accessible parishes
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "isActive": true
}
```

**Collection: `parishes`**
```json
{
  "_id": ObjectId,
  "name": "Archidiocèse de Cotonou",
  "slug": "cotonou",
  "description": "...",
  "address": "...",
  "phone": "...",
  "email": "...",
  "logo": "url",
  "banner": "url",
  "languages": ["fr", "en", "de"],
  "theme": "vatican-news",  // theme name
  "adminId": ObjectId,      // primary admin
  "menu": {
    "primary": [
      { "label": "Pape", "link": "/fr/pape", "order": 1 },
      { "label": "Vatican", "link": "/fr/vatican", "order": 2 },
      { "label": "Église", "link": "/fr/eglise", "order": 3 },
      { "label": "Monde", "link": "/fr/monde", "order": 4 }
    ]
  },
  "createdAt": ISODate,
  "isActive": true
}
```

**Collection: `pages`**
```json
{
  "_id": ObjectId,
  "parishId": ObjectId,
  "title": "Pape",
  "slug": "pape",
  "content": "HTML content",
  "language": "fr",
  "type": "static",  // static, blog, custom
  "author": ObjectId,
  "status": "published",  // draft, published, archived
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "publishedAt": ISODate
}
```

**Collection: `articles`**
```json
{
  "_id": ObjectId,
  "parishId": ObjectId,
  "title": "Article Title",
  "slug": "article-slug",
  "excerpt": "...",
  "content": "HTML content",
  "language": "fr",
  "category": "news",
  "image": "url",
  "author": ObjectId,
  "status": "published",
  "views": 0,
  "createdAt": ISODate,
  "updatedAt": ISODate,
  "publishedAt": ISODate
}
```

**Collection: `events`**
```json
{
  "_id": ObjectId,
  "parishId": ObjectId,
  "title": "Event Title",
  "slug": "event-slug",
  "description": "...",
  "startDate": ISODate,
  "endDate": ISODate,
  "location": "...",
  "image": "url",
  "status": "published",
  "createdAt": ISODate,
  "updatedAt": ISODate
}
```

### 2.C: Setup Database Script

**File: `server/config/db.js`**
```javascript
// Connection logic and schema initialization
const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✓ MongoDB connected');
    return true;
  } catch (error) {
    console.error('✗ MongoDB connection failed:', error.message);
    return false;
  }
}

module.exports = { connectDB };
```

---

## PHASE 3: STATIC-TO-DYNAMIC CONVERSION STRATEGY

### 3.A: URL Route Mapping

**Current Static Routes → New Dynamic Routes**

| Static File | New Route | Endpoint | Handler |
|---|---|---|---|
| `/fr.html` | `/` | GET / | Render home with parishes |
| `/fr/pape.html` | `/fr/pages/pape` | GET /api/pages/pape | pageController.getPage('pape') |
| `/fr/vatican.html` | `/fr/pages/vatican` | GET /api/pages/vatican | pageController.getPage('vatican') |
| `/fr/eglise.html` | `/fr/pages/eglise` | GET /api/pages/eglise | pageController.getPage('eglise') |
| `/fr/monde.html` | `/fr/pages/monde` | GET /api/pages/monde | pageController.getPage('monde') |
| `/fr/articles` | `/api/articles` | GET /api/articles | articleController.listArticles() |
| `/fr/article/:slug` | `/api/articles/:slug` | GET /api/articles/:slug | articleController.getArticle() |
| `/fr/events` | `/api/events` | GET /api/events | eventController.listEvents() |
| `/fr.rss.xml` | `/api/rss` | GET /api/rss | feedController.generateRSS() |

### 3.B: HTML Template Update Strategy

**Step 1: Create Intermediate JS Routing Layer**

Current approach: Static HTML files with hardcoded links  
New approach: Dynamic template engine (EJS/Handlebars) + API calls

**Example: `/fr.html` conversion**

**Before (Static):**
```html
<a href="fr/pape.html">Pape</a>
<a href="fr/vatican.html">Vatican</a>
<a href="fr/eglise.html">Église</a>
```

**After (Dynamic with JS):**
```html
<a href="/fr/pages/pape" data-page="pape">Pape</a>
<a href="/fr/pages/vatican" data-page="vatican">Vatican</a>
<a href="/fr/pages/eglise" data-page="eglise">Église</a>

<script>
  document.querySelectorAll('[data-page]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = e.target.dataset.page;
      fetch(`/api/pages/${page}`)
        .then(r => r.json())
        .then(data => {
          document.querySelector('main').innerHTML = data.content;
          window.history.pushState({}, '', `/fr/pages/${page}`);
        })
        .catch(() => window.location.href = `/fr/${page}.html`); // Fallback
    });
  });
</script>
```

### 3.C: Link Replacement in HTML Files

**Files to update:**
- `public/html/fr.html` (main navigation links)
- `public/html/fr/pape.html` → Convert to API response
- `public/html/fr/vatican.html` → Convert to API response
- `public/html/fr/eglise.html` → Convert to API response
- `public/html/fr/monde.html` → Convert to API response

**Step-by-step replacement:**

1. **Extract content from HTML files** → Store in MongoDB `pages` collection
   ```bash
   node scripts/migrate-html-to-db.js
   ```

2. **Replace href attributes** in main template:
   ```javascript
   // In fr.html
   OLD: href="fr/pape.html"
   NEW: href="/fr/pages/pape" onclick="loadPage(event, 'pape')"
   ```

3. **Create API wrapper** that serves either DB content or fallback HTML:
   ```javascript
   // server/routes/pages.js
   router.get('/api/pages/:slug', async (req, res) => {
     try {
       const page = await Page.findOne({ slug: req.params.slug, status: 'published' });
       if (!page) return res.status(404).json({ error: 'Not found' });
       res.json(page);
     } catch (error) {
       // Fallback to static HTML
       res.sendFile(`./public/html/fr/${req.params.slug}.html`);
     }
   });
   ```

### 3.D: Language & Parish Context

**Dynamic routing with language/parish prefix:**

```
/[paroisse]/[langue]/pages/[slug]
/cotonou/fr/pages/pape       → GET /api/pages/pape?parish=cotonou&lang=fr
/cotonou/en/pages/pope       → GET /api/pages/pope?parish=cotonou&lang=en
```

---

## PHASE 4: FALLBACK MECHANISM

### 4.A: Static Fallback Architecture

**Purpose:** If MongoDB is unavailable, serve pre-cached static HTML/JSON

```
server/fallback/
├── pages/
│   ├── pape.json
│   ├── vatican.json
│   ├── eglise.json
│   └── monde.json
├── articles.json
├── events.json
└── html/
    ├── fr.html
    ├── fr/pape.html
    ├── fr/vatican.html
    └── ...
```

### 4.B: Fallback Detection & Switching

**File: `server/middleware/fallbackHandler.js`**

```javascript
const fs = require('fs');
const path = require('path');

async function withFallback(primaryFn, fallbackFile) {
  try {
    return await primaryFn();  // Try database
  } catch (error) {
    console.warn(`DB error, switching to fallback: ${fallbackFile}`);
    if (fs.existsSync(fallbackFile)) {
      return JSON.parse(fs.readFileSync(fallbackFile, 'utf8'));
    }
    throw new Error('Both DB and fallback unavailable');
  }
}

module.exports = { withFallback };
```

### 4.C: Cache Invalidation & Update

**Whenever content changes in admin panel:**

1. Update MongoDB
2. Generate static JSON cache files
3. Update fallback directory

```javascript
// In pageController.updatePage()
await Page.updateOne({ _id }, { ...updateData });
await generateFallbackCache();  // Update static files
await clearPageCache();         // Clear in-memory cache
```

---

## PHASE 5: ADMIN USER CREATION

### 5.A: First Admin User Setup

**File: `seeds/seed-admin.js`**

```javascript
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const Admin = require('../server/models/Admin');
    
    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: 'admin@cotonou.local' });
    if (existingAdmin) {
      console.log('✓ Admin already exists');
      process.exit(0);
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash('ChangeMe123!', 10);
    
    // Create admin
    const admin = new Admin({
      name: 'Luc Admin',
      email: 'admin@cotonou.local',
      password: hashedPassword,
      role: 'super_admin',
      parishes: [],
      isActive: true
    });
    
    await admin.save();
    console.log('✓ Admin created:');
    console.log('  Email: admin@cotonou.local');
    console.log('  Password: ChangeMe123! (CHANGE THIS!)');
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
}

seedAdmin();
```

### 5.B: Create First Parish

**File: `seeds/seed-parish.js`**

```javascript
const mongoose = require('mongoose');
require('dotenv').config();

async function seedParish() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    const Admin = require('../server/models/Admin');
    const Parish = require('../server/models/Parish');
    
    // Get admin
    const admin = await Admin.findOne({ email: 'admin@cotonou.local' });
    if (!admin) {
      console.error('✗ Admin not found. Run seed-admin.js first');
      process.exit(1);
    }
    
    // Create parish
    const parish = new Parish({
      name: 'Archidiocèse de Cotonou',
      slug: 'cotonou',
      description: 'Archidiocèse catholique de Cotonou',
      address: 'Cotonou, Bénin',
      phone: '+229 XX XX XX XX',
      email: 'contact@archcotonou.bj',
      logo: '/assets/cotonou-logo.png',
      banner: '/assets/cotonou-banner.png',
      languages: ['fr'],
      theme: 'vatican-news',
      adminId: admin._id,
      isActive: true
    });
    
    await parish.save();
    
    // Link admin to parish
    admin.parishes.push(parish._id);
    await admin.save();
    
    console.log('✓ Parish created:');
    console.log('  Name:', parish.name);
    console.log('  Slug:', parish.slug);
    
    process.exit(0);
  } catch (error) {
    console.error('✗ Seed failed:', error.message);
    process.exit(1);
  }
}

seedParish();
```

### 5.C: Runbook - First Setup

```bash
# 1. Install dependencies
npm install

# 2. Start MongoDB
mongod --dbpath ./data

# 3. Create admin user
node seeds/seed-admin.js
# Output: admin@cotonou.local / ChangeMe123!

# 4. Create parish
node seeds/seed-parish.js
# Output: Archidiocèse de Cotonou created

# 5. Start server
npm run dev
# Server running on http://localhost:3000

# 6. Login to admin panel
# URL: http://localhost:3000/admin
# Email: admin@cotonou.local
# Password: ChangeMe123!
```

---

## PHASE 6: MULTI-PARISH SYSTEM PREPARATION

### 6.A: Multi-Parish Architecture

**Each parish has:**
- Unique domain or subdomain (`cotonou.local`, `porto-novo.local`, etc.)
- Separate admin users
- Own content (articles, pages, events)
- Shared theme (Vatican News template)

**Routes structure:**
```
/cotonou/fr/pages/pape           → Cotonou archdiocese content
/porto-novo/fr/pages/pape        → Porto-Novo parish content
```

### 6.B: Parish Detection Middleware

**File: `server/middleware/parishDetector.js`**

```javascript
async function detectParish(req, res, next) {
  // Extract from subdomain or path
  let parishSlug = req.subdomains[0] || req.params.parish || 'cotonou';
  
  const Parish = require('../models/Parish');
  const parish = await Parish.findOne({ slug: parishSlug, isActive: true });
  
  if (!parish) {
    return res.status(404).json({ error: 'Parish not found' });
  }
  
  req.parish = parish;
  next();
}

module.exports = { detectParish };
```

### 6.C: Adding New Parishes

**Admin panel UI:**
1. Super admin logs in
2. Click "Add Parish"
3. Fill form: Name, Slug, Description, etc.
4. System creates new parish + default admin user
5. New admin receives invitation email with credentials

**Database:**
```javascript
// Adding a new parish
const newParish = new Parish({
  name: 'Paroisse de Port-Novo',
  slug: 'porto-novo',
  adminId: newAdminId,
  ...
});
```

---

## PHASE 7: LOCAL DEVELOPMENT WORKFLOW

### 7.A: Development Tools Setup

```bash
# Install dev dependencies
npm install --save-dev nodemon concurrently

# package.json scripts
"scripts": {
  "dev": "concurrently \"npm run server\" \"npm run client\"",
  "server": "nodemon server/index.js",
  "client": "node scripts/watch-html.js",
  "seed": "node seeds/seed-admin.js && node seeds/seed-parish.js",
  "build": "node scripts/migrate-html-to-db.js",
  "start": "node server/index.js"
}
```

### 7.B: Testing & Validation

**Manual testing checklist:**

- [ ] MongoDB running locally
- [ ] Admin user created
- [ ] Parish created
- [ ] `/api/pages/pape` returns data
- [ ] Fallback works when DB offline
- [ ] Links in HTML render correctly
- [ ] Admin panel loads
- [ ] Can create/edit pages in admin

**API endpoints to test:**
```bash
# Test pages API
curl http://localhost:3000/api/pages/pape

# Test articles API
curl http://localhost:3000/api/articles

# Test fallback (stop MongoDB first)
curl http://localhost:3000/api/pages/pape
# Should serve cached version
```

### 7.C: Debugging & Logs

```javascript
// Enable debugging
DEBUG=cotonou-cms:* npm run dev

// Check logs
tail -f logs/app.log
```

---

## PHASE 8: NEXT STEPS → PRODUCTION

### 8.A: Migration Strategy

1. **Keep current setup running** on localhost:3000
2. **Set up staging environment** (test before production)
3. **Choose production DB:**
   - Option 1: MongoDB Atlas (cloud)
   - Option 2: MongoDB on separate server
4. **Deploy Express server** to Fly.io or similar
5. **Configure environment variables** for production

### 8.B: Production Deployment Checklist

- [ ] Environment variables set (.env.production)
- [ ] MongoDB Atlas cluster created & connected
- [ ] Fallback cache updated
- [ ] Admin credentials changed
- [ ] SSL/HTTPS enabled
- [ ] Backup strategy in place
- [ ] Monitoring & logging configured
- [ ] DNS records updated

---

## PHASE 9: SUMMARY OF FILES TO CREATE

**Core Backend Files:**
1. `server/index.js` - Express app
2. `server/config/db.js` - MongoDB connection
3. `server/models/Admin.js` - Admin schema
4. `server/models/Parish.js` - Parish schema
5. `server/models/Page.js` - Page schema
6. `server/routes/pages.js` - Page routes
7. `server/middleware/fallbackHandler.js` - Fallback logic
8. `server/controllers/pageController.js` - Page logic
9. `seeds/seed-admin.js` - Admin seeding

**Frontend Files:**
1. `public/html/fr.html` - Updated with dynamic links
2. `public/js/app.js` - Client-side routing

**Configuration Files:**
1. `.env.local` - Local env vars
2. `package.json` - Dependencies

**Total: ~15-20 files to create**

---

## QUICK START COMMAND

```bash
# 1. Clone repo
cd cotonou-cms

# 2. Install deps
npm install

# 3. Start MongoDB
mongod --dbpath ./data

# 4. Seed database
npm run seed

# 5. Start server
npm run dev

# 6. Open browser
http://localhost:3000/admin
```

---

**Next Step:** Start with Phase 1 (Project Structure) → Phase 2 (Database) → Test → Production
