const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customSchema = require("../managers/_common/schema.models");

let { title, text, username } = customSchema;
const schoolsSchema = new Schema({
  name: title,
  district: text,
  city: text,
  country: text,
  schooladmin: username,
});

module.exports = mongoose.model("schools", schoolsSchema);
