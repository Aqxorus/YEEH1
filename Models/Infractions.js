'use strict'
const { model, Schema } = require('mongoose')

module.exports = model(
  'Infractions',
  new Schema({
    guildId: String,
    userId: String,
    infractions: Array,
  })
)
