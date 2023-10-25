const express = require("express");

const Classroom = require("../models/Classroom");
const School = require("../models/School");
const validator = require("../validations/classroomValidations");
const jwt = require("jsonwebtoken");
const tokenSecret = require("../config/index.config.js").dotEnv
  .JWT_TOKEN_SECRET;

const classroomRoutes = express.Router();

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

classroomRoutes.get("/", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      Classroom.find()
        .then((classrooms) => {
          res.send({ data: classrooms });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

classroomRoutes.get("/byschool/:school", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      Classroom.find({school: req.params.school})
        .then((classrooms) => {
          res.send({ data: classrooms });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

classroomRoutes.get("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      try {
        let classroom = await Classroom.findById(req.params.id);
        if (!classroom) {
          res.status(404).send({ error: "Classroom not found" });
        } else {
          res.send({ data: classroom });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  });
});

classroomRoutes.post("/", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "schooladmin") {
        try {
          const isValidated = validator.createValidation.validate(req.body);
          if (isValidated.error)
            return res
              .status(400)
              .send({ error: isValidated.error.details[0].message });
          let school = await School.findOne({ name: req.body.school });
          if (school) {
            if (req.body.school === payload.school) {
              let classroom = await Classroom.findOne({ name: req.body.name });
              if (classroom) {
                res.status(400).send({ error: "name already exists" });
              } else {
                const newClassroom = await Classroom.create(req.body);
                res.send({
                  message: "Classroom created successfully",
                  data: newClassroom,
                });
              }
            } else {
              res.status(401).send({
                error: "You are not allowed to add classrooms in this school",
              });
            }
          } else {
            res.status(404).send({ error: "school doesn't exist" });
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        }
      } else {
        res
          .status(401)
          .send({ error: "Only school admins are authorized to do this" });
      }
    }
  });
});

classroomRoutes.put("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "schooladmin") {
        try {
          const isValidated = validator.updateValidation.validate(req.body);
          if (isValidated.error)
            return res
              .status(400)
              .send({ error: isValidated.error.details[0].message });
          let classroom = await Classroom.findById(req.params.id);
          if (!classroom) {
            res.status(404).send({ error: "Classroom not found" });
          } else {
            let classroom2 =
              req.body.name === null
                ? null
                : await Classroom.findOne({ name: req.body.name });
            if (classroom2 && classroom2._id != classroom._id) {
              res.status(400).send({ error: "this name already in-use" });
            } else {
              const updatedClassroom = await Classroom.findByIdAndUpdate(
                req.params.id,
                req.body
              );
              res.send({
                message: "Classroom updated successfully",
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
          .send({ error: "Only school admins are authorized to do this" });
      }
    }
  });
});

classroomRoutes.delete("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "schooladmin") {
        try {
          let classroom = await Classroom.findOneAndDelete(req.params.id);
          if (!classroom) {
            res.status(404).send({ error: "Classroom not found" });
          } else {
            res.send({
              message: "Classroom deleted successfully",
            });
          }
        } catch (err) {
          console.log(err);
          res.status(500).send({ error: "Internal Server Error" });
        }
      } else {
        res
          .status(401)
          .send({ error: "Only school admins are authorized to do this" });
      }
    }
  });
});

module.exports = classroomRoutes;
