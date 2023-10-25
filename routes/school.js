const express = require("express");

const School = require("../models/School");
const Admin = require("../models/Admin");
const validator = require("../validations/schoolValidations");
const jwt = require("jsonwebtoken");
const tokenSecret = require("../config/index.config.js").dotEnv
  .JWT_TOKEN_SECRET;

const schoolRoutes = express.Router();

const checkTocken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (typeof header !== "undefined") {
    const bearer = header.split(" ");
    const token = bearer[1];
    req.token = token;
    next();
  } else {
    res.status(401).send({ error: "You are not authorized to see this" });
  }
};

schoolRoutes.get("/", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      School.find()
        .then((schools) => {
          res.send({ data: schools });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

schoolRoutes.get("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      try {
        let school = await School.findById(req.params.id);
        if (!school) {
          res.status(404).send({ error: "School not found" });
        } else {
          res.send({ data: school });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  });
});

schoolRoutes.post("/", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "superadmin") {
        try {
          const isValidated = validator.createValidation.validate(req.body);
          if (isValidated.error)
            return res
              .status(400)
              .send({ error: isValidated.error.details[0].message });
          let school = await School.findOne({ name: req.body.name });
          if (school) {
            res.status(400).send({ error: "name already exists" });
          } else {
            let admin = await Admin.findOne({ username: req.body.schooladmin });
            if (admin) {
              if (admin.type === "schooladmin") {
                const newSchool = await School.create(req.body);
                res.send({
                  message: "School created successfully",
                  data: newSchool,
                });
              } else {
                res.status(400).send({ error: "admin must be a school admin" });
              }
            } else {
              res.status(404).send({ error: "School admin not found" });
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        }
      } else {
        res
          .status(401)
          .send({ error: "Only superadmins are authorized to do this" });
      }
    }
  });
});

schoolRoutes.put("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "superadmin") {
        try {
          const isValidated = validator.updateValidation.validate(req.body);
          if (isValidated.error)
            return res
              .status(400)
              .send({ error: isValidated.error.details[0].message });
          let school = await School.findById(req.params.id);
          if (!school) {
            res.status(404).send({ error: "School not found" });
          } else {
            let school2 =
              req.body.name === null
                ? null
                : await School.findOne({ name: req.body.name });
            if (school2 && school2._id != school._id) {
              res.status(400).send({ error: "this name already in-use" });
            } else {
              if (req.body.schooladmin) {
                let admin = await Admin.findOne({
                  username: req.body.schooladmin,
                });
                if (!admin) {
                  return res
                    .status(404)
                    .send({ error: "School admin not found" });
                } else {
                  if (admin.type !== "schooladmin") {
                    return res
                      .status(400)
                      .send({ error: "admin must be a school admin" });
                  }
                }
              }
              const updatedSchool = await School.findByIdAndUpdate(
                req.params.id,
                req.body
              );
              res.send({
                message: "School updated successfully",
              });
            }
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        }
      } else {
        res
          .status(401)
          .send({ error: "Only superadmins are authorized to do this" });
      }
    }
  });
});

schoolRoutes.delete("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "superadmin") {
        try {
          let school = await School.findOneAndDelete(req.params.id);
          if (!school) {
            res.status(404).send({ error: "School not found" });
          } else {
            res.send({
              message: "School deleted successfully",
            });
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        }
      } else {
        res
          .status(401)
          .send({ error: "Only superadmins are authorized to do this" });
      }
    }
  });
});

module.exports = schoolRoutes;
