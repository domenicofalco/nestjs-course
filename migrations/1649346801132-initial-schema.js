const { MigrationInterface, QueryRunner } = require('typeorm');

module.exports = class initialSchema1649346801132 {
  name = 'initialSchema1649346801132';

  async up(queryRunner) {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "admin" boolean NOT NULL DEFAULT (1))`,
    );
    await queryRunner.query(
      `CREATE TABLE "report" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "price" integer NOT NULL, "make" varchar NOT NULL, "model" varchar NOT NULL, "year" integer NOT NULL, "lng" integer NOT NULL, "lat" integer NOT NULL, "km" integer NOT NULL, "approved" boolean NOT NULL DEFAULT (0))`,
    );
  }

  async down(queryRunner) {
    await queryRunner.query(`DROP TABLE "report"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
};
