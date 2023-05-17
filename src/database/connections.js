const Sequelize = require("sequelize");
const config = require("../../config/config.json");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  {
    host: config.development.host,
    dialect: config.development.dialect,
    operatorsAliases: 0,
    pool: {
      max: config.development.pool.max,
      min: config.development.pool.min,
      acquire: config.development.pool.acquire,
      idle: config.development.pool.idle,
    },
  }
);

require("../models/user")(sequelize, Sequelize);
require("../models/role")(sequelize, Sequelize);
require("../models/assossiations")(sequelize, Sequelize);

module.exports = sequelize;
