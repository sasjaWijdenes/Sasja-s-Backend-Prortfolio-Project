const request = require("supertest"),
  db = require("../db/connection.js"),
  app = require("../db/app.js"),
  seed = require("../db/seeds/seed.js"),
  testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("Happy paths", () => {
    describe("/categories", () => {
      test("Should return an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body }) => {
            const { categories } = body;
            expect(categories).toHaveLength(4);
            expect(
              categories.forEach((obj) => {
                expect(obj).toEqual(
                  expect.objectContaining({
                    slug: expect.any(String),
                    description: expect.any(String),
                  })
                );
              })
            );
          });
      });
    });
    describe("/reviews", () => {
      describe("/review_id", () => {
        test("GET: Should return a review object relating to the passed review_id", () => {
          return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body }) => {
              const { review } = body;
              expect(review).toEqual({
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 1,
                review_id: 1,
              });
            });
        });
        test("PATCH: Should update votes property of review object with relevent review_is", () => {
          return request(app)
            .patch("/api/reviews/1")
            .send({ inc_votes: 3 })
            .expect(200)
            .then(({ body }) => {
              const { review } = body;
              expect(review).toEqual({
                title: "Agricola",
                designer: "Uwe Rosenberg",
                owner: "mallionaire",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "Farmyard fun!",
                category: "euro game",
                created_at: "2021-01-18T10:00:20.514Z",
                votes: 4,
                review_id: 1,
              });
            });
        });
      });
    });
    describe("/users", () => {
      test("Should return an array of all user objects", () => {
        return request(app)
          .get("/api/users")
          .expect(200)
          .then(({ body }) => {
            const { users } = body;
            expect(users).toHaveLength(4);
            expect(
              users.forEach((user) => {
                expect(user).toEqual(
                  expect.objectContaining({
                    username: expect.any(String),
                    name: expect.any(String),
                    avatar_url: expect.any(String),
                  })
                );
              })
            );
          });
      });
    });
  });
  describe("Error Handling", () => {
    test("404: Should return when passed an invalid route", () => {
      return request(app)
        .get("/api/invalidRoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("That route does not exist");
        });
    });
    test("400: Should return when passed an id that is not validto a get request", () => {
      return request(app)
        .get("/api/reviews/InvalidId")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid Id");
        });
    });
    test("400: Should return when passed an id that is not valid to a post request", () => {
      return request(app)
        .patch("/api/reviews/InvalidId")
        .send({ inc_votes: 4 })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid Id");
        });
    });
    test("404: should return when passed an id for object that doesnt exist", () => {
      return request(app)
        .get("/api/reviews/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("No user found for user 99999");
        });
    });
    test("404: should return when passed an id for object that doesnt exist", () => {
      return request(app)
        .patch("/api/reviews/99599")
        .send({ inc_votes: 5 })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("No user found for user 99599");
        });
    });
    test("404: Should return when passed a malformed body", () => {
      return request(app)
        .patch("/api/reviews/2")
        .send({})
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Passed malformed body");
        });
    });
    test("400: Should return when passed a body with property value of incorrect type", () => {
      return request(app)
        .patch("/api/reviews/3")
        .send({ inc_votes: "4" })
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe(
            "Request body has property of wrong data type."
          );
        });
    });
  });
});
