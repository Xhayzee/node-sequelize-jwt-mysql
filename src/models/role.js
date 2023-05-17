module.exports = (sequelize, Sequelize) => {
  const Role = sequelize.define(
    "role",
    {
      name: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "role",
    }
  );

  return Role;
};
