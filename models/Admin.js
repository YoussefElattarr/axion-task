const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customSchema = require("../managers/_common/schema.models");

let { username, password, text, title } = customSchema;
const adminsSchema = new Schema({
  username: username,
  password: password,
  type: text,
  school: title,
});

module.exports = mongoose.model("admins", adminsSchema);
