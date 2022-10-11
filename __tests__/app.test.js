const request = require("supertest"),
  db = require("../db/connection.js"),
  app = require("../db/app.js"),
  seed = require("../db/seeds/seed.js"),
  testData = require("../db/data/test-data/index.js");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("/categories", () => {
    describe("Happy path", () => {
      test("Should return an array of category objects", () => {
        return request(app)
          .get("/api/categories")
          .expect(200)
          .then(({ body: { categories } }) => {
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
      test("Should return an array of all review objects with an owner and comment_count", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(13);
            expect(
              reviews.forEach((review) => {
                expect(review).toEqual(
                  expect.objectContaining({
                    owner: expect.any(String),
                    designer: expect.any(String),
                    review_img_url: expect.any(String),
                    review_body: expect.any(String),
                    review_id: expect.any(Number),
                    category: expect.any(String),
                    title: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    comment_count: expect.any(Number),
                  })
                );
              })
            );
          });
      });
      describe("/review_id", () => {
        test("Should return a review object relating to the passed review_id", () => {
          return request(app)
            .get("/api/reviews/1")
            .expect(200)
            .then(({ body: { review } }) => {
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
                comment_count: 0,
              });
            });
        });
        test("Returned review item should have a comment count", () => {
          return request(app)
            .get("/api/reviews/3")
            .expect(200)
            .then(({ body: { review } }) => {
              expect(review).toEqual({
                title: "Ultimate Werewolf",
                designer: "Akihisa Okui",
                owner: "bainesface",
                review_img_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
                review_body: "We couldn't find the werewolf!",
                category: "social deduction",
                created_at: "2021-01-18T10:01:41.251Z",
                votes: 5,
                review_id: 3,
                comment_count: 3,
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
    test("400: Should return when passed an id that is not valid", () => {
      return request(app)
        .get("/api/reviews/InvalidId")
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
  });
});
