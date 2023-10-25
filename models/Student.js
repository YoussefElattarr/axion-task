const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customSchema = require("../managers/_common/schema.models");

let { title, number } = customSchema;
const studentsSchema = new Schema({
  name: title,
  age: number,
  school: title,
  classroom: title,
});

module.exports = mongoose.model("students", studentsSchema);
