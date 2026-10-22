import publicRoutes  from './publicRoutes.js';
import authRoutes    from './authRoutes.js';
import enquiryRoutes from './enquiryRoutes.js';
import adminRoutes   from './adminRoutes.js';

export default function mountRoutes(app) {
  app.use('/api',           publicRoutes);
  app.use('/api/auth',      authRoutes);
  app.use('/api/enquiries', enquiryRoutes);
  app.use('/api/admin',     adminRoutes);
}
