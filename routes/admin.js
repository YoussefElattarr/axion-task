const express = require("express");

const Admin = require("../models/Admin");
const validator = require("../validations/adminValidations");

const adminRoutes = express.Router();

adminRoutes.post("/", async (req, res) => {
  try {
    const isValidated = validator.createValidation.validate(req.body);
    if (isValidated.error)
      return res
        .status(400)
        .send({ error: isValidated.error.details[0].message });
    let admin = await Admin.findOne({ username: req.body.username });
    if (admin) {
      res.status(400).send({ error: "username already exists" });
    } else {
      const newAdmin = await Admin.create(req.body);
      res.send({ message: "Admin created successfully", data: newAdmin });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Internal Server Error" });
  }
});

module.exports = adminRoutes;
