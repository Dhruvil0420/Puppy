# TeddyPups U.A.E. 🐶
> Luxury Teacup Puppy Showroom in Downtown Dubai — Complete MERN Stack Application.

[![Frontend: React + Vite](https://img.shields.io/badge/Frontend-React_18_+_Vite_5-blue)](https://vitejs.dev/)
[![Backend: Node + Express](https://img.shields.io/badge/Backend-Node.js_+_Express-green)](https://expressjs.com/)
[![Database: MongoDB](https://img.shields.io/badge/Database-MongoDB_Atlas-brightgreen)](https://www.mongodb.com/atlas)
[![Media: Cloudinary](https://img.shields.io/badge/Media-Cloudinary_CDN-blueviolet)](https://cloudinary.com/)
[![Deploy: Vercel + Render](https://img.shields.io/badge/Deploy-Vercel_%2B_Render-black)](https://render.com)

---

## 📑 Table of Contents
1. [Overview & Live Links](#overview--live-links)
2. [Key Features](#key-features)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Prerequisites](#prerequisites)
6. [Environment Variables](#environment-variables)
7. [Installation & Local Setup](#installation--local-setup)
8. [Available NPM Scripts](#available-npm-scripts)
9. [API Documentation](#api-documentation)
10. [Cloudinary Setup](#cloudinary-setup)
11. [Deployment Guide](#deployment-guide)
12. [Testing & QA Checklist](#testing--qa-checklist)
13. [Security Notes](#security-notes)
14. [Troubleshooting](#troubleshooting)
15. [License & Credits](#license--credits)

---

## 🌐 Overview & Live Links
**TeddyPups U.A.E.** is a boutique teacup puppy showroom platform serving Dubai and the wider Emirates. It features an interactive public customer experience alongside an administrative management dashboard.

- **Frontend Application:** `http://localhost:5173` (Local) / Vercel
- **API Server:** `http://localhost:5000/api` (Local) / Render
- **Health Check Endpoint:** `GET /api/health`

---

## ✨ Key Features

### 🐾 Public Showroom Experience
- **Interactive Puppy Showcase:** Filter available puppies by breed (*Maltipoo, Pomeranian, Toy Poodle, Cavapoo, Shih Tzu*) and origin (*In Dubai vs Imported*).
- **Comprehensive Puppy Profiles:** High-resolution multi-angle Cloudinary photo gallery with swipe/arrow controls, image zoom Lightbox, video previews (`preload="metadata"`), and neighboring puppy navigation.
- **Enquiry System & Spam Defense:** Letter-style enquiry forms with real-time field validation, invisible honeypot field protection, and client/server rate limiting.
- **WhatsApp Direct Integration:** Pre-configured chat links with dynamically encoded puppy name, breed, and page URL.
- **Happy Families Gallery:** Real-life adoption showcase with interactive pagination.
- **FAQ Accordion & Guides:** Detailed FAQ with smooth animation and imported puppy travel guides.
- **SEO & Structured Data:** Semantic HTML5, dynamic title/description tags, OpenGraph previews, and Schema.org JSON-LD structured data (`LocalBusiness` and `Product`).
- **Responsive Architecture:** Clean layout across mobile (375px), tablet, and desktop with a slide-out mobile drawer and sticky action bar.

### 🛡️ Admin Management Dashboard
- **Secure Authentication:** JWT authentication with auto-logout on token expiration (HTTP 401 response interceptor).
- **Analytics Overview:** Real-time metrics tracking available pups, reserved pups, gone-home counts, and unread enquiries.
- **Puppy Management (Full CRUD):** Create, edit, toggle status (*Available, Reserved, Gone Home*), and delete puppies with automatic Cloudinary asset deletion.
- **Direct Cloudinary Media Uploads:** Multi-file image upload and single video upload with memory buffering directly to Cloudinary CDN.
- **Enquiry Management & CSV Export:** Search, status filtering (*New, Contacted, Closed*), notes updating, and one-click `.csv` spreadsheet export.
- **Happy Families & FAQ Management:** Inline modals for editing questions and photo stories.
- **Global Settings Configuration:** Admin panel controls phone, WhatsApp greeting, social media handles, and footer text.

---

## 💻 Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Client** | React 18, Vite 5, Tailwind CSS 3.4, React Router v6 (lazy & Suspense), `react-helmet-async`, `react-hot-toast`, Axios, `@/` path aliasing |
| **Server** | Node.js (ES Modules), Express 4, MongoDB / Mongoose 7, JWT, `express-validator`, `express-rate-limit`, `helmet`, `cors`, `compression`, `express-mongo-sanitize`, `streamifier` |
| **Media / CDN** | Cloudinary API (direct memory buffer streaming) |
| **Deployment** | Vercel (Client SPA with rewrite rules) & Render (API Web Service with `trust proxy`) |

---

## 📂 Project Structure

```text
Puppy/
├── client/
│   ├── public/                 # Static public assets (favicon, robots.txt, sitemap.xml)
│   ├── src/
│   │   ├── assets/             # Brand graphics and images
│   │   ├── components/
│   │   │   ├── admin/          # AdminLayout, ImageUploader, VideoField
│   │   │   ├── home/           # HeroSection, MeetThePups, Journey, Trust, FAQ previews
│   │   │   ├── layout/         # Header, Footer, Mobile Drawer, FloatingBar
│   │   │   ├── puppies/        # PuppyCard, PuppyGrid, EnquiryForm
│   │   │   └── ui/             # Accordion, Badge, Button, Lightbox, Skeleton, ErrorState
│   │   ├── context/            # AuthContext, SettingsContext
│   │   ├── hooks/              # Custom hooks (e.g., useScrollReveal)
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, Puppies, Enquiries, FAQs, Settings, Login
│   │   │   └── public/         # HomePage, PuppiesPage, Detail, GoneHome, FAQ, Contact, 404
│   │   ├── routes/             # AppRoutes, ProtectedRoute
│   │   ├── services/           # api.js (Axios instance + toast interceptor), uploadService.js
│   │   ├── utils/              # whatsapp.js and helpers
│   │   ├── App.jsx             # Providers + global react-hot-toast Toaster
│   │   ├── index.css           # Tailwind design tokens & font imports
│   │   └── main.jsx            # React root mount
│   ├── jsconfig.json           # IDE path aliasing config (@/* -> src/*)
│   ├── package.json            # Client dependencies and build scripts
│   ├── tailwind.config.js      # TeddyPups palette tokens (cream, cocoa, apricot, honey)
│   ├── vercel.json             # SPA routing rewrite rule
│   └── vite.config.js          # Vite config with @/ path resolver
├── server/
│   ├── config/                 # db.js (MongoDB), cloudinary.js (Cloudinary v2)
│   ├── controllers/            # Public & admin business logic controllers
│   ├── middleware/             # protect (JWT), upload (Multer memory), errorHandler, validate
│   ├── models/                 # Mongoose schemas (Puppy, Enquiry, Admin, FAQ, Setting, etc.)
│   ├── routes/                 # publicRoutes, authRoutes, adminRoutes, enquiryRoutes
│   ├── scripts/                # Database and media maintenance utilities
│   ├── seed/                   # Database seeder scripts (seed/index.js, images.json)
│   ├── utils/                  # cloudinaryUpload.js, fileHelper.js
│   ├── app.js                  # Express setup (security, rate limits, routes)
│   ├── server.js               # HTTP server entry point with graceful shutdown
│   ├── package.json            # Server dependencies
│   └── api.http                # REST client test requests
├── .gitignore                  # Git root ignore (protects .env, node_modules, uploads)
└── README.md                   # Complete unified documentation
```

---

## 📋 Prerequisites
- **Node.js**: `v18.0.0` or higher (recommended: `v20+` LTS)
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance
- **Cloudinary Account**: Cloud Name, API Key, and API Secret for media storage

---

## 🔐 Environment Variables

### Client (`client/.env`)
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

### Server (`server/.env`)
| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | API server listen port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/teddypups` |
| `JWT_SECRET` | Secret key for signing admin tokens | `super-secure-random-secret-key-32chars` |
| `JWT_EXPIRES_IN` | Token expiration duration | `7d` |
| `CLIENT_URL` | Frontend origin for CORS lockdown | `http://localhost:5173` |
| `ADMIN_EMAIL` | Default seeded admin email | `admin@teddypups.com` |
| `ADMIN_PASSWORD` | Default seeded admin password | `Admin@123` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API Key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret | `your_api_secret_key` |
| `CLOUDINARY_FOLDER` | Root folder for media uploads | `teddypups` |

---

## 🚀 Installation & Local Setup

### 1. Clone & Configure
```bash
git clone <repository-url>
cd Puppy

# Setup environment files
cp client/.env.example client/.env
cp server/.env.example server/.env
# Edit .env files with your MongoDB and Cloudinary credentials
```

### 2. Install Dependencies
```bash
# Install client packages
cd client
npm install

# Install server packages
cd ../server
npm install
```

### 3. Seed Database
```bash
cd server
npm run seed
# Populates admin account, site configuration, available puppies, FAQs, and testimonials.
```

### 4. Run Development Servers
```bash
# Terminal 1: Start API server (port 5000)
cd server
npm run dev

# Terminal 2: Start Client (port 5173)
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 📜 Available NPM Scripts

### Client (`client/package.json`)
- `npm run dev` — Launches Vite development server on `http://localhost:5173`.
- `npm run build` — Bundles production-optimized static assets to `/client/dist`.
- `npm run preview` — Locally preview the production build output.

### Server (`server/package.json`)
- `npm run dev` — Starts Node server with `nodemon` for auto-restart on changes.
- `npm start` — Starts Node server in production mode (`node server.js`).
- `npm run seed` — Resets and populates the database with default records.
- `npm run seed:images` — Uploads sample puppy images directly to Cloudinary.

---

## 📡 API Documentation

### Public Endpoints
| Method | Path | Description | Query Parameters |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and status | None |
| `GET` | `/api/settings` | General showroom contact settings | None |
| `GET` | `/api/puppies` | List available puppies | `breed`, `origin`, `gender`, `status`, `page`, `limit` (max 100) |
| `GET` | `/api/puppies/gone-home` | List adopted/sold puppies | None |
| `GET` | `/api/puppies/:slug` | Retrieve puppy detail + prev/next | None |
| `GET` | `/api/happy-families` | Adoption story gallery | `page`, `limit` |
| `GET` | `/api/testimonials` | Customer reviews | `featured=true` |
| `GET` | `/api/faqs` | Frequently asked questions | `home=true` |
| `POST` | `/api/enquiries` | Submit client puppy enquiry | Body: `{ name, phone, email, area, message, puppySlug }` |

### Auth Endpoints
| Method | Path | Description | Authentication |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin | Public (Rate-limited: 10 attempts/15 min) |
| `GET` | `/api/auth/me` | Fetch active profile | Bearer Token Required |
| `POST` | `/api/auth/logout` | Clear token | Bearer Token Required |

### Admin Endpoints (Require `Authorization: Bearer <token>`)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/api/admin/stats` | Aggregate dashboard statistics |
| `GET` | `/api/admin/puppies` | List puppies with search & status filters |
| `POST` | `/api/admin/puppies` | Create a new puppy record |
| `PUT` | `/api/admin/puppies/:id` | Update puppy information |
| `PATCH` | `/api/admin/puppies/:id/status` | Instant status change (`available`, `reserved`, `gone-home`) |
| `DELETE` | `/api/admin/puppies/:id` | Delete puppy record and corresponding Cloudinary assets |
| `GET` | `/api/admin/enquiries` | List inquiries with filters |
| `GET` | `/api/admin/enquiries/export.csv` | Download enquiry records as CSV |
| `PATCH` | `/api/admin/enquiries/:id` | Update enquiry notes and status |
| `DELETE` | `/api/admin/enquiries/:id` | Delete enquiry record |
| `POST` | `/api/admin/upload/images` | Upload up to 8 images to Cloudinary (Multipart) |
| `POST` | `/api/admin/upload/video` | Upload video up to 30MB to Cloudinary (Multipart) |
| `GET` / `PUT` | `/api/admin/settings` | Read and update showroom configuration |

---

## ☁️ Cloudinary Setup
1. Create a Cloudinary account at [cloudinary.com](https://cloudinary.com).
2. Copy your **Cloud Name**, **API Key**, and **API Secret** into `server/.env`.
3. In [server/middleware/upload.js](file:///d:/Puppy/server/middleware/upload.js), Multer buffers uploaded files in memory (`multer.memoryStorage()`).
4. [server/utils/cloudinaryUpload.js](file:///d:/Puppy/server/utils/cloudinaryUpload.js) streams the file buffers to your designated folder (`CLOUDINARY_FOLDER`).
5. When a puppy or family story is deleted via the Admin Portal, `cloudinary.uploader.destroy()` automatically removes the corresponding assets from your Cloudinary account.

---

## 🚢 Deployment Guide

### Deploying API on Render
1. Push your repository to GitHub.
2. In [Render Dashboard](https://dashboard.render.com), create a new **Web Service**.
3. Link your repository and set:
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
4. Set Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `MONGO_URI`: Your MongoDB Atlas URI
   - `JWT_SECRET`: Random secret string
   - `CLIENT_URL`: `https://<your-vercel-domain>.vercel.app`
   - `CLOUDINARY_*`: Cloudinary credentials
5. Open the Render Shell tab once deployed and run `npm run seed` to populate your production database.

### Deploying Frontend on Vercel
1. In [Vercel Dashboard](https://vercel.com), import your GitHub repository.
2. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variable:
   - `VITE_API_URL`: `https://<your-render-service>.onrender.com/api`
4. Deploy. The included [client/vercel.json](file:///d:/Puppy/client/vercel.json) rewrites all incoming routes to `/index.html` for single-page routing.

---

## 🧪 Testing & QA Checklist

- **Client Production Build**:
  ```bash
  cd client
  npm run build
  ```
- **Backend Health Check**:
  ```bash
  curl http://localhost:5000/api/health
  ```
- **Manual QA Test Flow**:
  1. **Showroom Flow**: Open `/`, browse to `/puppies`, filter by breed/origin, and navigate to `/puppies/:slug`.
  2. **Gallery & Video**: Test photo slide counter, lightbox zoom, and video playback.
  3. **Enquiry Validation**: Submit invalid phone or email on `/contact` and puppy detail page; confirm field validation errors and toast alert.
  4. **Admin Security**: Open `/admin` while unauthenticated -> verify redirect to `/admin/login`.
  5. **Admin Operations**: Log in (`admin@teddypups.com` / `Admin@123`), create/edit puppy, change status, test CSV export, and log out.

---

## 🛡️ Security Notes
- **Reverse Proxy Support**: `app.set('trust proxy', 1)` allows secure cookie and IP handling behind load balancers.
- **Rate Limiting**: Brute-force protection on `/api/auth/login` (10 requests/15 min) and spam defense on `/api/enquiries` (5 submissions/15 min).
- **NoSQL Injection**: `express-mongo-sanitize` strips `$` and `.` operators from incoming request bodies and query parameters.
- **Sanitized Errors**: The central error handler in [server/middleware/errorHandler.js](file:///d:/Puppy/server/middleware/errorHandler.js) hides stack traces in production (`NODE_ENV === 'production'`).
- **Secret Protection**: `.env` files are excluded from Git via root `.gitignore`.

---

## 🔧 Troubleshooting

- **Puppy detail page crashes with `useMemo is not defined`**:
  - Ensure [PuppyDetailPage.jsx](file:///d:/Puppy/client/src/pages/public/PuppyDetailPage.jsx) includes `useMemo` in its React import statement:
    `import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react';`
- **Images or video not uploading in Admin**:
  - Verify Cloudinary credentials in `server/.env`.
  - Confirm file sizes are within limits (images ≤ 5MB, video ≤ 30MB).
- **CORS Error on frontend**:
  - Ensure `CLIENT_URL` in `server/.env` exactly matches your frontend domain (including protocol and port, without trailing slash).
- **Render Cold Starts**:
  - Render free tier instances sleep after inactivity. The health check (`GET /api/health`) can be pinged to wake the service.

---

## 📄 License & Credits
- **Project**: TeddyPups U.A.E. Showroom
- **Copyright**: © 2026 TeddyPups U.A.E. All rights reserved.
