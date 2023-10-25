const express = require("express");

const Student = require("../models/Student");
const School = require("../models/School");
const Classroom = require("../models/Classroom");
const validator = require("../validations/studentValidations");
const jwt = require("jsonwebtoken");
const tokenSecret = require("../config/index.config.js").dotEnv
  .JWT_TOKEN_SECRET;

const studentRoutes = express.Router();

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

studentRoutes.get("/", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      Student.find()
        .then((students) => {
          res.send({ data: students });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

studentRoutes.get("/byschool/:school", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      Student.find({ school: req.params.school })
        .then((students) => {
          res.send({ data: students });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

studentRoutes.get("/byclassroom/:classroom", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      Student.find({ classroom: req.params.classroom })
        .then((students) => {
          res.send({ data: students });
        })
        .catch((err) => {
          res.status(400).send(err);
        });
    }
  });
});

studentRoutes.get("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      try {
        let student = await Student.findById(req.params.id);
        if (!student) {
          res.status(404).send({ error: "Student not found" });
        } else {
          res.send({ data: student });
        }
      } catch (err) {
        console.log(err);
        res.status(500).send({ error: "Internal Server Error" });
      }
    }
  });
});

studentRoutes.post("/", checkTocken, (req, res) => {
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
          if (!school) {
            res.status(404).send({ error: "School does not exist" });
          } else {
            let classroom = await Classroom.findOne({
              name: req.body.classroom,
            });
            if (!classroom) {
              res.status(404).send({ error: "Classroom does not exist" });
            } else {
              if (payload.school === req.body.school && classroom.school === req.body.school) {
                const newStudent = await Student.create(req.body);
                res.send({
                  message: "Student created successfully",
                  data: newStudent,
                });
              } else {
                res.status(400).send({
                  error: "You are not allowed to add students in this school/classroom",
                });
              }
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

studentRoutes.put("/:id", checkTocken, (req, res) => {
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
          let student = await Student.findById(req.params.id);
          if (!student) {
            res.status(404).send({ error: "Student not found" });
          } else {
            if (req.body.classroom) {
              let classroom = await Classroom.findOne({
                name: req.body.classroom,
              });
              if (!classroom) {
                return res.status(404).send({ error: "Classroom not found" });
              } else {
                if (classroom.school != payload.school) {
                  return res
                    .status(400)
                    .send({
                      error: "This classroom is out of your jurisdiction",
                    });
                }
              }
            }
            const updatedStudent = await Student.findByIdAndUpdate(
              req.params.id,
              req.body
            );
            res.send({
              message: "Studnet updated successfully",
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

studentRoutes.delete("/:id", checkTocken, (req, res) => {
  jwt.verify(req.token, tokenSecret, async (err, payload) => {
    if (err) {
      res.status(403).send(err);
    } else {
      if (payload.type === "schooladmin") {
        try {
          let student = await Student.findOneAndDelete(req.params.id);
          if (!student) {
            res.status(404).send({ error: "Student not found" });
          } else {
            res.send({
              message: "Student deleted successfully",
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

module.exports = studentRoutes;
