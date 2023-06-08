'use strict'

var mongoose = require("mongoose"),
    Schema = mongoose.Schema;


const Admin = new Schema({
    email: { type: String, required: true },
    encryptedPassword: { type: String, required: true },
    role: { type: String, enum: ['admin', 'restricted'], required: true }
  })

  module.exports = mongoose.model("Admins", Admin);