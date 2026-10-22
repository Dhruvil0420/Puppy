const notFound = (req, res, _next) => {
  res.status(404).json({
    success: false,
    message: `Not found – ${req.originalUrl}`,
  });
};

export default notFound;
