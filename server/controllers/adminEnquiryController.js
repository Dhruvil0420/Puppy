import Enquiry from '../models/Enquiry.js';

/* ── helpers ───────────────────────────────────────────────────── */
function csvEscape(val) {
  if (val == null) return '';
  const s = String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/* ── GET /api/admin/enquiries ──────────────────────────────────── */
export const listEnquiries = async (req, res, next) => {
  try {
    const { status, source, q, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (q) {
      filter.$or = [
        { name:      { $regex: q, $options: 'i' } },
        { email:     { $regex: q, $options: 'i' } },
        { phone:     { $regex: q, $options: 'i' } },
        { puppyName: { $regex: q, $options: 'i' } },
      ];
    }

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    const [enquiries, total] = await Promise.all([
      Enquiry.find(filter)
        .populate('puppy', 'name slug')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Enquiry.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: enquiries,
      meta: { total, page: pageNum, limit: limitNum, pages: Math.ceil(total / limitNum) },
    });
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/enquiries/export.csv ───────────────────────── */
export const exportEnquiriesCsv = async (_req, res, next) => {
  try {
    const enquiries = await Enquiry.find()
      .populate('puppy', 'name slug')
      .sort({ createdAt: -1 })
      .lean();

    const headers = [
      'Name', 'Phone', 'Email', 'Area', 'Message',
      'Puppy', 'Source', 'Status', 'Admin Note', 'IP', 'Created At',
    ];

    const rows = enquiries.map((e) =>
      [
        csvEscape(e.name),
        csvEscape(e.phone),
        csvEscape(e.email),
        csvEscape(e.area),
        csvEscape(e.message),
        csvEscape(e.puppyName || ''),
        csvEscape(e.source),
        csvEscape(e.status),
        csvEscape(e.adminNote),
        csvEscape(e.ip),
        e.createdAt?.toISOString() || '',
      ].join(',')
    );

    const csv = [headers.join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=enquiries-${Date.now()}.csv`);
    res.send(csv);
  } catch (err) {
    next(err);
  }
};

/* ── GET /api/admin/enquiries/:id ──────────────────────────────── */
export const getEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id).populate('puppy', 'name slug');
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};

/* ── PATCH /api/admin/enquiries/:id ────────────────────────────── */
export const updateEnquiry = async (req, res, next) => {
  try {
    const { status, adminNote } = req.body;
    const update = {};
    if (status)              update.status    = status;
    if (adminNote !== undefined) update.adminNote = adminNote;

    const enquiry = await Enquiry.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    }).populate('puppy', 'name slug');

    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};

/* ── DELETE /api/admin/enquiries/:id ───────────────────────────── */
export const deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, data: { message: 'Enquiry deleted' } });
  } catch (err) {
    next(err);
  }
};
