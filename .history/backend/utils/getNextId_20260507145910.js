module.exports = async (Model) => {

  // Get last valid numeric id
  const last = await Model.findOne({
    id: {
      $type: 'number'
    }
  })
  .sort({
    id: -1
  });

  // If no valid docs
  if (!last || typeof last.id !== 'number') {
    return 1;
  }

  return last.id + 1;
};