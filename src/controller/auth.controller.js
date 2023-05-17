const { Op } = require("sequelize");
const sequelize = require("../database/connections");
const User = sequelize.models.user;
const Role = sequelize.models.role;
var jwt = require("jsonwebtoken");
var bcrypt = require("bcrypt");

const secretKey = process.env.SECRET_KEY;

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  })
    .then((user) => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles,
            },
          },
        }).then((roles) => {
          user.setRoles(roles).then(() => {
            res.status(200).send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.status(200).send({ message: "User registered successfully!" });
        });
      }
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      username: req.body.username,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      console.log(user);

      var authorities = [];
      user.getRoles().then((roles) => {
        console.log(roles);
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
      });

      console.log(authorities);

      const signedUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        roles: authorities,
        createdAt: user.createdAt,
      };

      var token = jwt.sign({ ...signedUser }, secretKey, {
        expiresIn: 86400, // 24 hours
      });

      res.status(200).send({
        ...signedUser,
        accessToken: `Bearer ${token}`,
      });
    })
    .catch((err) => {
      res.status(500).send({ message: err.message });
    });
};
