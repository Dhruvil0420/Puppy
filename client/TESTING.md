# TeddyPups U.A.E. — Comprehensive Testing Checklist

This document outlines verification steps for every feature, form, page, and admin endpoint in the application.

---

## 1. Public Pages & Navigation
- [ ] **Announcement Bar**: Displays `"every puppy is family"` and paw animation.
- [ ] **Sticky Header**:
  - Links: Home, Puppies, Happy families, How it works, FAQ, Visit & contact.
  - Active page highlights with honey pill and paw icon.
  - "WhatsApp us" button redirects to `wa.me/971541676733` with encoded greeting.
- [ ] **Mobile Drawer ("where to, friend?")**:
  - Opens on clicking "Menu" button on viewports < 1024px.
  - Locks background `body` scroll.
  - Closes on clicking "Close", pressing `Escape`, or clicking any navigation link.
- [ ] **Floating Mobile Bottom Bar**:
  - Visible only on mobile screens.
  - Direct "WhatsApp us" and "Call" triggers work.
- [ ] **Footer**:
  - Correct social links (Instagram, TikTok, Facebook).
  - Showroom address, email, phone, and WhatsApp links.
  - Explore navigation links.
  - Link to Admin portal (`/admin/login`).

---

## 2. Homepage Sections (1–8)
- [ ] **Hero Section**:
  - Eyebrow *"every puppy is family"* and H1 *"Premium teacup puppies in Dubai"*.
  - Auto-playing 6-puppy slideshow: changes every 4.5s, pauses on mouse hover, dot indicators reflect active slide, caption links to `/puppies/:slug`.
- [ ] **Meet the Pups**:
  - Numbered tiles (01, 02, etc.) loaded from `/api/puppies`.
  - 16th tile is "Meet them all" linked to `/puppies`.
- [ ] **Two ways to meet your puppy**:
  - "Puppies in Dubai" card links to `/puppies?origin=dubai`.
  - "Imported for you" card links to `/puppies?origin=imported`.
- [ ] **Your puppy journey**:
  - 3 chronological steps.
  - WhatsApp chat mockup card with live breed chips (`/puppies?breed=...`), 4-photo showroom strip, and "Say hello on WhatsApp".
- [ ] **Why families trust TeddyPups**:
  - 4 cards with icons (Vet-checked, Korea to Dubai safely, 24/7 Support, Trusted worldwide).
- [ ] **Happy Families Preview**:
  - Featured testimonial quote card with author and location.
  - 4-photo preview grid and link to `/happy-families`.
- [ ] **FAQ Preview**:
  - 3 accordion items from `/api/faqs?home=true`.
  - "Read all questions" links to `/faq`.
- [ ] **Final CTA**:
  - Image of Max with "Can't wait to meet you!" badge.
  - "Enquire on WhatsApp" and "Visit & contact" buttons.

---

## 3. Catalog Page (`/puppies`) & Filter System
- [ ] Filter by breed chips: Maltipoo, Pomeranian, Poodle, Cavapoo, Shih Tzu.
- [ ] Filter by origin: In Dubai, Imported.
- [ ] URL updates search query params (`?breed=&origin=`).
- [ ] Browser Back and Forward buttons preserve filter states.
- [ ] "Showing N puppies" count accurately updates.
- [ ] "Clear all filters" resets params and shows all available puppies.
- [ ] Empty state appears when no puppies match filter with direct WhatsApp CTA.
- [ ] "Already gone home" section at bottom displays up to 5 sold puppies with link to `/gone-home`.

---

## 4. Puppy Detail Page (`/puppies/:slug`)
- [ ] Correct puppy information, photos, gender, estimated adult weight, and status badge.
- [ ] Slide counter (`‹ 1 / N ›`) with left/right buttons, arrow keys, and thumbnail clicks.
- [ ] Video thumbnail plays inline video when clicked.
- [ ] Clicking main image opens Lightbox with ESC and keyboard navigation.
- [ ] Details table shows breed, gender, age, and showroom location.
- [ ] "Ask about {name} on WhatsApp" includes puppy name, breed, and current page URL.
- [ ] "Send an enquiry" scrolls down smoothly to the enquiry form.
- [ ] "Every Teddy Pup comes" checklist displayed.
- [ ] 4-step "Coming home from abroad" (for imported pups) or 3-step local visit guide.
- [ ] Previous Pup / Next Pup cards wrap around.
- [ ] Gone-home puppy shows "gone home ♥" banner and hides the enquiry form.

---

## 5. Forms & Spam Protection
- [ ] **Enquiry Form (`/puppies/:slug`)**:
  - Validates name (2-80 chars) and phone (6-20 digits).
  - Honeypot `website` field is invisible to users; if filled by bots, returns fake 201 without saving.
  - Rate limiting (5 per 15 min per IP) handled gracefully.
  - Form resets and displays success notification upon submission.
- [ ] **Contact Letter-Style Form (`/contact`)**:
  - Interactive Mad Libs style inputs.
  - Query parameter `?puppy=slug` pre-selects the requested puppy in dropdown.
  - Google Maps showroom link points to `https://maps.app.goo.gl/ZdJvwHBSQWWZT54s7`.

---

## 6. How It Works, FAQ, and Happy Families
- [ ] **`/how-it-works`**:
  - Sticky sub-navigation (Two ways home, Our puppy promise, Delivery & collection, Why choose us).
  - Scroll-spy highlights active section smoothly.
- [ ] **`/faq`**:
  - Displays all 9 FAQs in accordion format with `aria-expanded` attributes.
  - JSON-LD structured data included in document `<head>`.
- [ ] **`/happy-families`**:
  - Counter pill displays `{total} moments and counting`.
  - Sarah M. featured review quote.
  - Masonry grid with image zoom lightbox.
  - "Load more" button increments pagination.

---

## 7. Admin Panel (`/admin`)
- [ ] Protected route redirects unauthenticated visitors to `/admin/login`.
- [ ] Auto-logout triggers if token expires or on HTTP 401 response.
- [ ] **Dashboard (`/admin`)**:
  - Aggregate statistics (Available, Reserved, Gone Home, New Enquiries).
  - Table of recent 5 enquiries.
- [ ] **Puppies (`/admin/puppies`)**:
  - Search by name, breed, or color.
  - Quick status dropdown changes status and updates database.
  - Add/Edit form with multi-image upload preview and removal.
  - Video upload support.
  - Permanent delete modal confirmation.
- [ ] **Enquiries (`/admin/enquiries`)**:
  - Filters by status (new, contacted, closed) and source.
  - Detail drawer displays message, internal admin notes, and "Reply on WhatsApp" link.
  - "Export CSV" downloads full spreadsheet.
- [ ] **Happy Families (`/admin/happy-families`)**:
  - Upload photo with caption and instant delete.
- [ ] **FAQs (`/admin/faqs`)**:
  - Add, edit, delete, and toggle `showOnHome`.
- [ ] **Settings (`/admin/settings`)**:
  - Update WhatsApp number, phone, email, showroom address, social URLs, and default message.

---

## 8. SEO, Responsiveness & Polish
- [ ] `robots.txt` disallows `/admin` and links to `sitemap.xml`.
- [ ] `sitemap.xml` lists all 7 canonical public routes.
- [ ] No horizontal overflow or layout breakage at screen widths:
  - 360px (Small Mobile)
  - 390px (iPhone 14)
  - 768px (Tablet portrait)
  - 1024px (Tablet landscape / small laptop)
  - 1280px+ (Desktop)
- [ ] Lazy loading enabled for all route chunks and images.
