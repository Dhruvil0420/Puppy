import Puppy from '../models/Puppy.js';

/* Card-view projection – excludes long description */
const CARD_FIELDS =
  'name slug displayTitle breed breedGroups gender ageLabel origin status ' +
  'images videoUrl videoPoster videoPublicId featuredOnHero showOnHome sortOrder createdAt';

const formatPuppyCard = (puppy) => {
  if (!puppy) return puppy;
  const photos = (puppy.images || []).map((img) => (typeof img === 'string' ? img : img.url)).filter(Boolean);
  return {
    ...puppy,
    primaryImage: photos[0] || '',
    photos,
  };
};

/* ── GET /api/puppies ──────────────────────────────────────────── */
export const getPuppies = async (req, res, next) => {
  try {
    const {
      breed,
      origin,
      gender,
      status = 'available',
      featured,
      showOnHome,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (status)                  filter.status = status;
    if (breed)                   filter.breedGroups = breed;        // matches inside array
    if (origin)                  filter.origin = origin;
    if (gender)                  filter.gender = gender;
    if (featured  !== undefined) filter.featuredOnHero = featured === 'true';
    if (showOnHome !== undefined) filter.showOnHome    = showOnHome === 'true';

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [puppies, total] = await Promise.all([
      Puppy.find(filter)
        .select(CARD_FIELDS)
        .sort({ sortOrder: 1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Puppy.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: puppies.map(formatPuppyCard),
      meta: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/puppies/gone-home ────────────────────────────────── */
export const getGoneHomePuppies = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const filter = { status: 'gone-home' };

    const [puppies, total] = await Promise.all([
      Puppy.find(filter)
        .select(CARD_FIELDS)
        .sort({ goneHomeAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Puppy.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: puppies.map(formatPuppyCard),
      meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/puppies/:slug  →  { puppy, prev, next } ─────────── */
export const getPuppyBySlug = async (req, res, next) => {
  try {
    const puppyDoc = await Puppy.findOne({ slug: req.params.slug }).lean();
    if (!puppyDoc) {
      return res.status(404).json({ success: false, message: 'Puppy not found' });
    }

    const puppy = formatPuppyCard(puppyDoc);

    // prev/next only for available puppies; wrap-around at edges
    let prev = null;
    let nextPuppy = null;

    if (puppy.status === 'available') {
      const available = await Puppy.find({ status: 'available' })
        .select('slug name')
        .sort({ sortOrder: 1, createdAt: -1 })
        .lean();

      if (available.length > 1) {
        const idx = available.findIndex((p) => p.slug === puppy.slug);
        if (idx !== -1) {
          const prevIdx = idx === 0 ? available.length - 1 : idx - 1;
          const nextIdx = idx === available.length - 1 ? 0 : idx + 1;
          prev      = { slug: available[prevIdx].slug, name: available[prevIdx].name };
          nextPuppy = { slug: available[nextIdx].slug, name: available[nextIdx].name };
        }
      }
    }

    res.json({
      success: true,
      data: { puppy, prev, next: nextPuppy },
    });
  } catch (err) {
    next(err);
  }
};
