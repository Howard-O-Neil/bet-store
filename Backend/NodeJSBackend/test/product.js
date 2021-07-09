process.env.NODE_ENV = "test";

//let Book = require('../app/models/book');

//Require the dev-dependencies
let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require("../server");
let should = chai.should();
const { dummy_product } = require("./dummy_data");
chai.use(chaiHttp);
//Our parent block
describe("Products", async () => {
  beforeEach((done) => {
    //Before each test we do something

    done();
  });
  /*
   * Test the /GET route
   */
  describe("/GET products", () => {
    it("it should GET all the products", (done) => {
      chai
        .request(server)
        .get("/api/products")
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
  describe("/POST products", () => {
    it("it should not POST a category without required field", (done) => {
      let product = {
        name: "Nhà lầu xe hơi",
      };
      chai
        .request(server)
        .post("/api/products")
        .send(product)
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
    //     .post("/api/products")
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
  describe("/GET/:id products", () => {
    it("it should GET a cateogries by the given id", (done) => {
      const id = "5fe984037e440200567b5ebc";
      chai
        .request(server)
        .get("/api/products/" + id)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("name");
          res.body.should.have.property("description");
          res.body.should.have.property("image");
          res.body.should.have.property("properties");
          res.body.should.have.property("category");
          res.body.should.have.property("user");
          res.body.should.have.property("price");
          res.body.should.have.property("_id").eql(id);
          done();
        });
    });
  });
  /*
   * Test the /PUT/:id route
   */
  describe("/PUT/:id products", async () => {
    const id = "5fe984037e440200567b5ebc";

    it("it should UPDATE a product given the id", (done) => {
      chai
        .request(server)
        .put("/api/products/" + id)
        .send(dummy_product)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("message").eql("Product updated");
          done();
        });
    });
  });
});
