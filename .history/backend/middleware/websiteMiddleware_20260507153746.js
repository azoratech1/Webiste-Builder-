module.exports = (req, res, next) => {

  const websiteId =
    req.headers['x-website-id'];

  if (!websiteId) {

    return res.status(400).json({
      success: false,
      error: 'Website ID required'
    });
  }

  req.website_id = Number(
    websiteId
  );

  next();
};