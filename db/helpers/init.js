class Db {
  constructor() {
    this.Sequelize = require("sequelize");
  }

  init() {
    const dbName = process.env.PG_DATABASE;
    const dbUsername = process.env.PG_USER;
    const dbPassword = process.env.PG_PASSWORD;
    const dbHost = process.env.PG_HOST;
    const dbPort = process.env.PG_PORT;
    return new this.Sequelize(dbName, dbUsername, dbPassword, {
      host: dbHost,
      port: dbPort,
      dialect: "postgres",
    });
  }
}

module.exports = new Db().init();
