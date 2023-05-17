module.exports = (sequelize, Sequelize) => {
  const User = sequelize.models.user;
  const Role = sequelize.models.role;

  User.belongsToMany(Role, {
    through: "users_roles",
    foreignKey: "userId",
    otherKey: "roleId",
  });

  Role.belongsToMany(User, {
    through: "users_roles",
    foreignKey: "roleId",
    otherKey: "userId",
  });
};
