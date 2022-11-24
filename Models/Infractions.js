const { model, Schema } = require('mongoose');

module.exports = model(
  'Infractions',
  new Schema({
    Guild: String,
    UserID: String,
    Infractions: Array,
  })
);
