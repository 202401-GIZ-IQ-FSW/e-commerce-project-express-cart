const getUpdateFields = (body) => {
  const { title, image, price, description, availableCount, category } = body;
  const updateFields = {};

  if (title) updateFields.title = title;
  if (image) updateFields.image = image;
  if (price) updateFields.price = price;
  if (description) updateFields.description = description;
  if (availableCount) updateFields.availableCount = availableCount;
  if (category) updateFields.category = category;

  return updateFields;
};

module.exports = { getUpdateFields };
