const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const customSchema = require("../managers/_common/schema.models");

let { title, username, number } = customSchema;
const classroomsSchema = new Schema({
  name: title,
  school: title,
  floor: number,
});

module.exports = mongoose.model("classrooms", classroomsSchema);
