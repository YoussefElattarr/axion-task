const jwt = require("jsonwebtoken");
const tokenSecret = require("../config/index.config.js").dotEnv.JWT_TOKEN_SECRET;
const express = require("express");
const router = express.Router();

const Admin = require("../models/Admin");

router.post("/", async (req, res) => {
  try {
    const { username, password } = req.body;
    let admin = await Admin.findOne({ username: username });
    if (admin) {
      if (admin.password === password) {
        const payload = {
          id: admin._id,
          username: username,
          type: admin.type,
          school: admin.school
        };
        jwt.sign(payload, tokenSecret, { expiresIn: "1h" }, (err, token) => {
          return res.json({ message: "Logged in successfully", token: token });
        });
      } else {
        res.status(400).send({ error: "wrong password" });
      }
    } else {
      return res.status(404).json({ error: "username does not exist" });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router