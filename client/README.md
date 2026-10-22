# TeddyPups U.A.E. — Client (React 18 + Vite + Tailwind)

Frontend web application for **TeddyPups U.A.E.** (Downtown Dubai luxury teacup puppy showroom).

## Technology Stack
- **Framework**: React 18 (Vite 5)
- **Styling**: Tailwind CSS 3.4 (custom cream `#fffdf8`, cocoa `#2a170e`, honey `#fce3b4`, apricot `#e48a58`)
- **Routing**: `react-router-dom` v6 with lazy loading & Suspense
- **HTTP Client**: `axios` with automatic Bearer token injection
- **SEO & Head**: `react-helmet-async` with dynamic meta, Open Graph, and JSON-LD structured data

## Getting Started

### 1. Environment Variables
Create a `.env` file in `/client`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 2. Install & Run Locally
```bash
npm install
npm run dev
```
The app will be accessible at: `http://localhost:5173`

### 3. Build for Production
```bash
npm run build
```
Production assets are generated in `/client/dist`.

---

## Deployment on Vercel

1. Push the repository to GitHub.
2. In Vercel, import the repository and set the **Root Directory** to `client`.
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed Express API URL (e.g. `https://teddypups-api.onrender.com/api`)
4. SPA routing is already configured in `vercel.json` (`rewrites` to `/index.html`).
5. Click **Deploy**.
