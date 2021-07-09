process.env.NODE_ENV = "test";

//let Book = require('../app/models/book');
const Category = require("../models/categoryModel");
//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
const { dummy_category } = require("./dummy_data");
chai.use(chaiHttp);
//Our parent block
describe("Categories", async () => {
  beforeEach((done) => {
    //Before each test we empty the database

    done();
  });
  /*
   * Test the /GET route
   */
  describe("/GET categories", () => {
    it("it should GET all the categories", (done) => {
      chai
        .request(server)
        .get("/api/categories")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("array");

          done();
        });
    });
  });

  /*
   * Test the /POST route
   */
  describe("/POST categories", () => {
    it('it should not POST a category without /"path/" field', (done) => {
      let category = {
        name: "Nhà ở",
      };
      chai
        .request(server)
        .post("/api/categories")
        .send(category)
        .end((err, res) => {
          res.should.have.status(500);

          done();
        });
    });
    // it("it should POST a category ", (done) => {
    //   let category = {
    //     name: "Nhà ở",
    //     path: "/nha-o",
    //   };
    //   chai
    //     .request(server)
    //     .post("/api/categories")
    //     .send(category)
    //     .end((err, res) => {
    //       res.should.have.status(201);
    //       res.body.should.be.a("object");
    //       res.body.should.have
    //         .property("message")
    //         .eql("Category created successfully!");

    //       done();
    //     });
    // });
  });
  /*
   * Test the /GET/:id route
   */
  describe("/GET/:id categories", () => {
    it("it should GET a cateogries by the given id", (done) => {
      const id = "5fe8be697288d60037154bcf";
      chai
        .request(server)
        .get("/api/categories/" + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("path");
          res.body.should.have.property("image");
          res.body.should.have.property("properties");
          res.body.should.have.property("_id").eql(id);
          done();
        });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  describe("/PUT/:id categories", async () => {
    const id = "5fe8be697288d60037154bcf";

    it("it should UPDATE a category given the id", (done) => {
      chai
        .request(server)
        .put("/api/categories/" + id)
        .send(dummy_category)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Category updated");
          done();
        });
    });
  });
});
