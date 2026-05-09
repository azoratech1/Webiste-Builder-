// module.exports = async (Model) => {

//   // Get last valid numeric id
//   const last = await Model.findOne({
//     id: {
//       $type: 'number'
//     }
//   })
//   .sort({
//     id: -1
//   });

//   // If no valid docs
//   if (!last || typeof last.id !== 'number') {
//     return 1;
//   }

//   return last.id + 1;
// };
module.exports = async (
  Model,
  website_id
) => {

  const last = await Model
    .findOne({
      website_id
    })
    .sort({ id: -1 });

  return last
    ? last.id + 1
    : 1;
};