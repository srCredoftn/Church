# IMPLEMENTATION PLAN: Vatican News Theme → Multi-Parish CMS
## Archidiocèse de Cotonou - Local Development with MongoDB Community

**Version:** 2.0  
**Date:** October 2025  
**Environment:** Local (Node.js + MongoDB Community) → Production (Express API + Fallback)  
**Recommended Execution Order:** Phase 1 → Phase 2 → Phase 5 → (Then Phases 3,4,6,7,8,9)

---

## 📋 RECOMMENDED PHASES CHRONOLOGY

**Quick Start Path (Next 30 minutes):**
1. ✅ **Phase 1** - Setup project structure
2. ✅ **Phase 2** - Setup MongoDB & create schemas  
3. ✅ **Phase 5** - Create first admin user & parish

**Then Advanced (Next 2 hours):**
4. **Phase 3** - Convert static links to dynamic routes
5. **Phase 4** - Implement fallback mechanism
6. **Phase 6** - Multi-parish preparation
7. **Phase 7** - Local development workflow
8. **Phase 8** - Production migration strategy
9. **Phase 9** - Summary & next steps

---

## ✅ PHASE 1: PROJECT ARCHITECTURE & SETUP

**Execution Order:** 1️⃣ **FIRST (Do This Now)**  
**Duration:** ~10 minutes  
**Dependencies:** None  
**Deliverables:** Project structure, package.json, config files  
**Success Criteria:** All folders created, npm install runs without errors

### 1.A: Technology Stack

```
Frontend:  HTML/CSS/JS (current Vatican News theme)
Backend:   Node.js + Express.js
Database:  MongoDB Community (local development)
Cache:     JSON static files (fallback mechanism)
```

### 1.B: Step 1.1 - Create Project Directory Structure

**Command to execute:**
```bash
# 1. Create main project directory
mkdir cotonou-cms && cd cotonou-cms

# 2. Create all subdirectories
mkdir -p server/{config,models,routes,middleware,controllers,utils,fallback/{pages,api,html}}
mkdir -p public/{html/fr,css,js,assets}
mkdir -p admin-panel/css
mkdir -p seeds
mkdir -p logs
mkdir -p data
```

**Folder Structure Created:**

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
├── logs/                        # Application logs
├── data/                        # MongoDB local data
├── .env.local                   # Local environment variables
├── .env.production              # Production env vars
├── package.json                 # Dependencies
├── server.js                    # App launcher
└── IMPLEMENTATION_PLAN.md       # This file
```

### 1.C: Step 1.2 - Create package.json

**File: `package.json`**

Create file and paste:

```json
{
  "name": "cotonou-cms",
  "version": "1.0.0",
  "description": "Archidiocèse de Cotonou - Multi-Parish CMS",
  "main": "server.js",
  "type": "module",
  "scripts": {
    "dev": "nodemon server/index.js",
    "start": "node server/index.js",
    "seed:admin": "node seeds/seed-admin.js",
    "seed:parish": "node seeds/seed-parish.js",
    "seed": "npm run seed:admin && npm run seed:parish",
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [
    "cms",
    "parish",
    "multi-tenant",
    "mongodb"
  ],
  "author": "Luc",
  "license": "MIT",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.3",
    "cors": "^2.8.5",
    "helmet": "^7.0.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.0"
  }
}
```

### 1.D: Step 1.3 - Create .env.local Configuration

**File: `.env.local`**

Create file and paste:

```env
# Development Environment
NODE_ENV=development
PORT=3000

# MongoDB Local
MONGO_URI=mongodb://localhost:27017/cotonou-cms

# JWT Configuration
JWT_SECRET=your-local-secret-key-change-in-production
JWT_EXPIRE=7d

# Admin Setup
ADMIN_EMAIL=admin@cotonou.local
ADMIN_PASSWORD=ChangeMe123!

# App Configuration
FALLBACK_MODE=true
FALLBACK_CACHE_DIR=./server/fallback
SITE_NAME=Archidiocèse de Cotonou
```

### 1.E: Step 1.4 - Install Dependencies

**Command:**
```bash
npm install
```

Expected output:
```
added 150 packages
```

### 1.F: Verification

**Run command:**
```bash
npm list
```

Should show:
- ✅ express@^4.18.2
- ✅ mongoose@^7.0.0
- ✅ bcryptjs@^2.4.3
- ✅ jsonwebtoken@^9.0.0
- ✅ nodemon@^3.0.0

---

## ✅ PHASE 2: DATABASE SETUP & SCHEMAS

**Execution Order:** 2️⃣ **SECOND (Do This Next)**  
**Duration:** ~15 minutes  
**Dependencies:** Phase 1 completed, MongoDB installed locally  
**Deliverables:** MongoDB connection, all models created  
**Success Criteria:** Can connect to MongoDB, all schemas created

### 2.A: Step 2.1 - Install & Start MongoDB Community

**Installation (Choose your OS):**

```bash
# macOS (with Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Linux (Ubuntu/Debian)
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
sudo apt-get install -y mongodb-org
sudo systemctl start mongod

# Windows
# Download from: https://www.mongodb.com/try/download/community
# Run installer and start MongoDB service
```

**Verify MongoDB is running:**
```bash
mongosh --version
mongosh localhost:27017/cotonou-cms
# Should show: test> (you're in MongoDB shell)
# Type: exit
```

### 2.B: Step 2.2 - Create MongoDB Connection File

**File: `server/config/db.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';

async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✓ MongoDB connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`✗ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
}

export { connectDB };
```

### 2.C: Step 2.3 - Create Admin Model

**File: `server/models/Admin.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['super_admin', 'admin'],
    default: 'admin'
  },
  parishes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parish'
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
```

### 2.D: Step 2.4 - Create Parish Model

**File: `server/models/Parish.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';

const parishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  description: String,
  address: String,
  phone: String,
  email: String,
  logo: String,
  banner: String,
  languages: {
    type: [String],
    default: ['fr']
  },
  theme: {
    type: String,
    default: 'vatican-news'
  },
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  menu: {
    primary: [{
      label: String,
      link: String,
      order: Number
    }]
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Parish = mongoose.model('Parish', parishSchema);

export default Parish;
```

### 2.E: Step 2.5 - Create Page Model

**File: `server/models/Page.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';

const pageSchema = new mongoose.Schema({
  parishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parish',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'fr'
  },
  type: {
    type: String,
    enum: ['static', 'blog', 'custom'],
    default: 'static'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date
});

const Page = mongoose.model('Page', pageSchema);

export default Page;
```

### 2.F: Step 2.6 - Create Article Model

**File: `server/models/Article.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema({
  parishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parish',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  excerpt: String,
  content: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'fr'
  },
  category: String,
  image: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: Date
});

const Article = mongoose.model('Article', articleSchema);

export default Article;
```

### 2.G: Step 2.7 - Create Event Model

**File: `server/models/Event.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  parishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Parish',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  location: String,
  image: String,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const Event = mongoose.model('Event', eventSchema);

export default Event;
```

### 2.H: Verification - Test MongoDB Connection

**Command:**
```bash
# Create temporary test file
cat > server/test-db.js << 'EOF'
import { connectDB } from './config/db.js';
import 'dotenv/config';

connectDB().then(() => {
  console.log('✓ Database test successful!');
  process.exit(0);
}).catch(err => {
  console.error('✗ Database test failed:', err);
  process.exit(1);
});
EOF

# Run test
node server/test-db.js

# Clean up
rm server/test-db.js
```

Expected output:
```
✓ MongoDB connected: localhost
✓ Database test successful!
```

---

## ✅ PHASE 5: CREATE FIRST ADMIN USER & PARISH

**Execution Order:** 3️⃣ **THIRD (Do This Right After Phase 2)**  
**Duration:** ~10 minutes  
**Dependencies:** Phase 1 & Phase 2 completed, MongoDB running  
**Deliverables:** First admin user, first parish created  
**Success Criteria:** Can login with admin@cotonou.local

### 5.A: Step 5.1 - Create Admin Seeding Script

**File: `seeds/seed-admin.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import 'dotenv/config';
import Admin from '../server/models/Admin.js';

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (existingAdmin) {
      console.log('ℹ Admin already exists');
      process.exit(0);
    }

    // Create admin
    const admin = new Admin({
      name: 'Luc Admin',
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PASSWORD,
      role: 'super_admin',
      parishes: [],
      isActive: true
    });

    await admin.save();

    console.log('✓ Admin user created successfully!');
    console.log('───────────────────────────────────');
    console.log('📧 Email: ' + process.env.ADMIN_EMAIL);
    console.log('🔐 Password: ' + process.env.ADMIN_PASSWORD);
    console.log('───────────────────────────────────');
    console.log('⚠️  IMPORTANT: Change password after first login!');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedAdmin();
```

### 5.B: Step 5.2 - Create Parish Seeding Script

**File: `seeds/seed-parish.js`**

Create and paste:

```javascript
import mongoose from 'mongoose';
import 'dotenv/config';
import Admin from '../server/models/Admin.js';
import Parish from '../server/models/Parish.js';

async function seedParish() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    // Get admin
    const admin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!admin) {
      console.error('✗ Admin not found. Run seed-admin.js first');
      process.exit(1);
    }

    // Check if parish exists
    const existingParish = await Parish.findOne({ slug: 'cotonou' });
    if (existingParish) {
      console.log('ℹ Parish already exists');
      process.exit(0);
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
      menu: {
        primary: [
          { label: 'Pape', link: '/fr/pages/pape', order: 1 },
          { label: 'Vatican', link: '/fr/pages/vatican', order: 2 },
          { label: 'Église', link: '/fr/pages/eglise', order: 3 },
          { label: 'Monde', link: '/fr/pages/monde', order: 4 }
        ]
      },
      isActive: true
    });

    await parish.save();

    // Link admin to parish
    admin.parishes.push(parish._id);
    await admin.save();

    console.log('✓ Parish created successfully!');
    console.log('───────────────────────────────────');
    console.log('🏛️  Name: ' + parish.name);
    console.log('📍 Slug: ' + parish.slug);
    console.log('🌍 Languages: ' + parish.languages.join(', '));
    console.log('───────────────────────────────────');

    process.exit(0);
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

seedParish();
```

### 5.C: Step 5.3 - Run Seeding Scripts

**Commands:**

```bash
# 1. Seed admin user
npm run seed:admin

# Expected output:
# ✓ Admin user created successfully!
# ───────────────────────────────────
# 📧 Email: admin@cotonou.local
# 🔐 Password: ChangeMe123!
# ───────────────────────────────────

# 2. Seed parish
npm run seed:parish

# Expected output:
# ✓ Parish created successfully!
# ───────────────────────────────────
# 🏛️  Name: Archidiocèse de Cotonou
# 📍 Slug: cotonou
# 🌍 Languages: fr
# ───────────────────────────────────
```

### 5.D: Verification - Check MongoDB Data

**Command:**
```bash
mongosh localhost:27017/cotonou-cms
```

**In MongoDB shell:**
```javascript
// Check admin
db.admins.findOne({ email: 'admin@cotonou.local' })

// Check parish
db.parishes.findOne({ slug: 'cotonou' })

// Exit
exit
```

Expected output:
```javascript
{
  _id: ObjectId("..."),
  name: 'Luc Admin',
  email: 'admin@cotonou.local',
  role: 'super_admin',
  isActive: true,
  ...
}

{
  _id: ObjectId("..."),
  name: 'Archidiocèse de Cotonou',
  slug: 'cotonou',
  adminId: ObjectId("..."),
  ...
}
```

---

## ✅ COMPLETION CHECKLIST - PHASES 1, 2, 5

After completing all three phases, verify:

- [ ] Phase 1: All folders created (`cotonou-cms/` structure)
- [ ] Phase 1: `npm install` completed successfully
- [ ] Phase 1: `.env.local` file created with correct values
- [ ] Phase 2: MongoDB installed and running locally
- [ ] Phase 2: All 5 models created (Admin, Parish, Page, Article, Event)
- [ ] Phase 2: Database connection test passed (`✓ MongoDB connected`)
- [ ] Phase 5: Admin user created (`admin@cotonou.local`)
- [ ] Phase 5: Parish created (`Archidiocèse de Cotonou`)
- [ ] Phase 5: Can verify data in MongoDB shell

**🎉 If all checked: Ready for Phase 3 (Dynamic Routes)**

---

## NEXT STEPS (After Phases 1, 2, 5)

Once completed, proceed to:

1. **Phase 3** - Convert static links to dynamic routes
2. **Phase 4** - Implement fallback mechanism
3. **Phase 6** - Multi-parish preparation
4. **Phase 7** - Local development workflow
5. **Phase 8** - Production migration strategy
6. **Phase 9** - Summary & next steps

---

## 🆘 TROUBLESHOOTING

**MongoDB not starting?**
```bash
# Check if already running
lsof -i :27017

# Kill existing process if needed
pkill -f mongod

# Start fresh
mongod --dbpath ./data
```

**npm dependencies conflict?**
```bash
rm package-lock.json
npm cache clean --force
npm install
```

**Port 3000 already in use?**
```bash
# Change PORT in .env.local
PORT=3001

# Or kill the process
lsof -i :3000
kill -9 <PID>
```

---

**Status: Ready for implementation** ✅  
**Last Updated:** October 2025
