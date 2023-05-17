const sequelize = require("../database/connections");
const User = sequelize.models.user;
const Role = sequelize.models.role;
const UsersRoles = sequelize.models.users_roles;

exports.freshSeed = async (req, res) => {
  try {
    await sequelize.sync({ force: true }).then(async () => {
      await Role.bulkCreate([
        {
          name: "Admin",
        },
        {
          name: "User",
        },
      ]);

      await User.bulkCreate([
        {
          username: "john",
          name: "John Doe",
          email: "john@example.com",
          password:
            "$2b$08$w9VCLEHbnAETeBqzsuwiVeDMVPqliXdphGW1JyOTbQUMtcLfbH48m",
        },
        {
          username: "jane",
          name: "Jane Smith",
          email: "jane@example.com",
          password:
            "$2b$08$w9VCLEHbnAETeBqzsuwiVeDMVPqliXdphGW1JyOTbQUMtcLfbH48m",
        },
        {
          username: "bob",
          name: "Bob Johnson",
          email: "bob@example.com",
          password:
            "$2b$08$w9VCLEHbnAETeBqzsuwiVeDMVPqliXdphGW1JyOTbQUMtcLfbH48m",
        },
      ]);

      await UsersRoles.bulkCreate([
        { userId: 1, roleId: 1 },
        { userId: 2, roleId: 1 },
        { userId: 3, roleId: 1 },
      ]);
    });

    res.status(200).send({
      message: "Seed Refreshed !!!",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "Failed",
    });
  }
};
