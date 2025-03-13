const mongoose = require('mongoose');

// Validate MongoDB ObjectId
const validateObjectId = (id) => {
  return mongoose.Types.ObjectId.isValid(id);
};

module.exports = {
  validateObjectId
}; 