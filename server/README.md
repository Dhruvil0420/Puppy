# TeddyPups U.A.E. — API Server

Teacup puppy showroom backend for [TeddyPups](https://puppy.instabizweb.com/).  
**Stack:** Node.js · Express · MongoDB / Mongoose · JWT auth.

---

## Quick Start

```bash
# 1. Install dependencies
cd server
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your values (see Environment Variables below)

# 3. Seed the database
npm run seed

# 4. Start development server
npm run dev
```

The server starts on **http://localhost:5000**.  
Health check: `GET /api/health`

---

## Environment Variables

| Variable         | Description                          | Default                              |
| ---------------- | ------------------------------------ | ------------------------------------ |
| `PORT`           | Server port                          | `5000`                               |
| `MONGO_URI`      | MongoDB connection string            | `mongodb://localhost:27017/teddypups` |
| `JWT_SECRET`     | Secret key for signing JWT tokens    | *(required)*                         |
| `JWT_EXPIRES_IN` | Token lifetime                       | `7d`                                 |
| `CLIENT_URL`     | Frontend origin for CORS             | `http://localhost:5173`              |
| `ADMIN_EMAIL`    | Seeded admin email                   | `admin@teddypups.com`                |
| `ADMIN_PASSWORD` | Seeded admin password                | `Admin@123`                          |

---

## NPM Scripts

| Script          | Command              | Description                      |
| --------------- | -------------------- | -------------------------------- |
| `npm run dev`   | `nodemon server.js`  | Dev server with hot reload       |
| `npm start`     | `node server.js`     | Production start                 |
| `npm run seed`  | `node seed/index.js` | Wipe DB and insert demo data     |

---

## API Endpoints

### Public

| Method | Path                      | Description                     |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/api/health`             | Health check                    |
| GET    | `/api/settings`           | Site settings                   |
| GET    | `/api/puppies`            | Available puppies (filterable)  |
| GET    | `/api/puppies/gone-home`  | Gone-home puppies               |
| GET    | `/api/puppies/:slug`      | Puppy detail + prev/next        |
| GET    | `/api/happy-families`     | Happy families gallery          |
| GET    | `/api/testimonials`       | Testimonials (?featured=true)   |
| GET    | `/api/faqs`               | FAQs (?home=true)               |
| POST   | `/api/enquiries`          | Submit enquiry (rate limited)   |

### Auth

| Method | Path              | Description           |
| ------ | ----------------- | --------------------- |
| POST   | `/api/auth/login` | Login → JWT token     |
| GET    | `/api/auth/me`    | Current admin profile |
| POST   | `/api/auth/logout`| Logout (stateless)    |

### Admin (Bearer token required)

| Method | Path                             | Description               |
| ------ | -------------------------------- | ------------------------- |
| GET    | `/api/admin/stats`               | Dashboard statistics      |
| GET    | `/api/admin/puppies`             | List (search, paginate)   |
| POST   | `/api/admin/puppies`             | Create puppy              |
| GET    | `/api/admin/puppies/:id`         | Get puppy                 |
| PUT    | `/api/admin/puppies/:id`         | Update puppy              |
| PATCH  | `/api/admin/puppies/:id/status`  | Change status             |
| PATCH  | `/api/admin/puppies/reorder`     | Bulk reorder              |
| DELETE | `/api/admin/puppies/:id`         | Delete puppy + files      |
| GET    | `/api/admin/enquiries`           | List (filter, search)     |
| GET    | `/api/admin/enquiries/export.csv`| CSV download              |
| GET    | `/api/admin/enquiries/:id`       | Get enquiry               |
| PATCH  | `/api/admin/enquiries/:id`       | Update status / note      |
| DELETE | `/api/admin/enquiries/:id`       | Delete enquiry            |
| GET    | `/api/admin/happy-families`      | List                      |
| POST   | `/api/admin/happy-families`      | Create                    |
| PUT    | `/api/admin/happy-families/:id`  | Update                    |
| DELETE | `/api/admin/happy-families/:id`  | Delete + file             |
| GET    | `/api/admin/faqs`                | List                      |
| POST   | `/api/admin/faqs`                | Create                    |
| PUT    | `/api/admin/faqs/:id`            | Update                    |
| DELETE | `/api/admin/faqs/:id`            | Delete                    |
| GET    | `/api/admin/testimonials`        | List                      |
| POST   | `/api/admin/testimonials`        | Create                    |
| PUT    | `/api/admin/testimonials/:id`    | Update                    |
| DELETE | `/api/admin/testimonials/:id`    | Delete                    |
| GET    | `/api/admin/settings`            | Get settings              |
| PUT    | `/api/admin/settings`            | Update settings           |
| POST   | `/api/admin/upload/images`       | Upload images (max 8×5 MB)|
| POST   | `/api/admin/upload/video`        | Upload video (≤ 30 MB)    |

### Query Parameters

**Puppies:**  `breed`, `origin`, `gender`, `status` (default `available`), `featured`, `showOnHome`, `page`, `limit` (max 100)

**Enquiries (admin):** `status` (new|contacted|closed), `source` (contact|puppy), `q` (search), `page`, `limit`

---

## API Response Format

```jsonc
// Success
{ "success": true, "data": { ... }, "meta": { "total": 20, "page": 1, "limit": 20, "pages": 1 } }

// Error
{ "success": false, "message": "Validation failed", "errors": [{ "field": "name", "message": "Name must be 2-80 characters" }] }
```

---

## Deploy on Render with MongoDB Atlas

### 1. MongoDB Atlas

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. **Network Access → Add IP Address → Allow access from anywhere** (`0.0.0.0/0`) so Render can connect.
3. Copy the connection string: `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/teddypups`.

### 2. Render Web Service

1. Push the repo to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. **Environment Variables:**

   | Key              | Value                                        |
   | ---------------- | -------------------------------------------- |
   | `PORT`           | `10000` (Render default)                     |
   | `MONGO_URI`      | Your Atlas connection string                 |
   | `JWT_SECRET`     | A strong random string                       |
   | `JWT_EXPIRES_IN` | `7d`                                         |
   | `CLIENT_URL`     | Your deployed frontend URL (for CORS)        |
   | `ADMIN_EMAIL`    | `admin@teddypups.com`                        |
   | `ADMIN_PASSWORD` | A strong password                            |
   | `NODE_ENV`       | `production`                                 |

6. After first deploy, open the **Shell** tab and run `npm run seed`.

### 3. Important Notes

> **Local uploads are ephemeral on Render.** The free tier filesystem is wiped on every deploy. For production images/videos, integrate a cloud storage service like **Cloudinary**, **AWS S3**, or **Firebase Storage** and update the upload controller to upload there instead of to disk.

> Set `CLIENT_URL` to your exact frontend domain (e.g., `https://teddypups.example.com`) so CORS works correctly.

> The server uses `trust proxy` so rate limiting works behind Render's proxy.

---

## Project Structure

```
server/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Login / me / logout
│   ├── settingController.js   # Public settings
│   ├── puppyController.js     # Public puppy routes
│   ├── happyFamilyController.js
│   ├── testimonialController.js
│   ├── faqController.js
│   ├── enquiryController.js   # Public enquiry POST
│   ├── adminStatsController.js
│   ├── adminPuppyController.js
│   ├── adminEnquiryController.js
│   ├── adminHappyFamilyController.js
│   ├── adminFaqController.js
│   ├── adminTestimonialController.js
│   ├── adminSettingController.js
│   └── uploadController.js
├── middleware/
│   ├── protect.js             # JWT auth guard
│   ├── validate.js            # express-validator result handler
│   ├── notFound.js            # 404 handler
│   └── errorHandler.js        # Central error handler
├── models/
│   ├── Admin.js
│   ├── Puppy.js
│   ├── Enquiry.js
│   ├── Testimonial.js
│   ├── HappyFamily.js
│   ├── Faq.js
│   └── Setting.js
├── routes/
│   ├── index.js               # Mounts all route groups
│   ├── publicRoutes.js
│   ├── authRoutes.js
│   ├── enquiryRoutes.js
│   └── adminRoutes.js
├── seed/
│   └── index.js               # DB seed script
├── utils/
│   ├── multerConfig.js        # Image + video upload config
│   └── fileHelper.js          # File deletion helpers
├── public/uploads/            # Uploaded files (gitignored)
├── app.js                     # Express app setup
├── server.js                  # Entry point + graceful shutdown
├── api.http                   # REST Client test requests
├── .env.example
└── package.json
```
