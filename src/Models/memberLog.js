'use strict';
const { Schema, model } = require('mongoose');

module.exports = model(
  'memberLog',
  new Schema({
    Guild: String,
    logChannel: String,
    memberRole: String,
    botRole: String,
  })
);
