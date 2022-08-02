import { MigrationInterface, QueryRunner } from "typeorm";

export class addEntity1659212358882 implements MigrationInterface {
    name = 'addEntity1659212358882'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "images_product" ("id" SERIAL NOT NULL, "url" character varying NOT NULL, "key" character varying NOT NULL, "product_id" integer, CONSTRAINT "PK_96fabbb1202770b8e6a58bf6f1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "params_products" ("id" SERIAL NOT NULL, "screen" character varying, "camera" character varying, "processor" character varying, "RAM" character varying, "memory" text, "corps" character varying, "GPS" character varying, "type" character varying, CONSTRAINT "PK_71b5c42aaf525ea2680f3688fa4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."Product_state_enum" AS ENUM('New', 'Used')`);
        await queryRunner.query(`CREATE TABLE "Product" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "price" integer NOT NULL, "state" "public"."Product_state_enum" NOT NULL DEFAULT 'New', "description" character varying NOT NULL, "color" text, "rating" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "category_id" integer, "params_id" integer, CONSTRAINT "REL_f28b438add55aaf08e2908d827" UNIQUE ("params_id"), CONSTRAINT "PK_9fc040db7872192bbc26c515710" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category_products" ("id" SERIAL NOT NULL, "category" character varying NOT NULL, CONSTRAINT "PK_f0ced3e957f2edbbc572b171686" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('User', 'Admin')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "age" integer, "password" character varying NOT NULL, "role" "public"."user_role_enum" NOT NULL DEFAULT 'User', "phone" character varying NOT NULL, "isEmailConfirmed" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "images_product" ADD CONSTRAINT "FK_91c3d6895c79f70a56fa0872bc1" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_f9b5114e0cfa9a3c5bdf606aedb" FOREIGN KEY ("category_id") REFERENCES "category_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Product" ADD CONSTRAINT "FK_f28b438add55aaf08e2908d8276" FOREIGN KEY ("params_id") REFERENCES "params_products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_f28b438add55aaf08e2908d8276"`);
        await queryRunner.query(`ALTER TABLE "Product" DROP CONSTRAINT "FK_f9b5114e0cfa9a3c5bdf606aedb"`);
        await queryRunner.query(`ALTER TABLE "images_product" DROP CONSTRAINT "FK_91c3d6895c79f70a56fa0872bc1"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "category_products"`);
        await queryRunner.query(`DROP TABLE "Product"`);
        await queryRunner.query(`DROP TYPE "public"."Product_state_enum"`);
        await queryRunner.query(`DROP TABLE "params_products"`);
        await queryRunner.query(`DROP TABLE "images_product"`);
    }

}
