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
  });
  describe("/reviews", () => {
    describe("/review_id", () => {
      test("Should return a review object relating to the passed review_id", () => {
        return request(app)
          .get("/api/reviews/1")
          .expect(200)
          .then(({ body }) => {
            const { review } = body;
            console.log(review, "<<<review passed to test");
            expect(review).toEqual({
              review_id: 1,
              title: "Culture a Love of Agriculture With Agricola ",
              category: "strategy",
              designer: "Uwe Rosenberg",
              owner: "tickle122",
              review_body: expect.any(String),
              review_img_url:
                "https://images.pexels.com/photos/4917821/pexels-photo-4917821.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260 ",
              created_at: "2021-01-18 10:00:20.514",
              votes: 1,
            });
          });
      });
    });
  });
  describe("Error Handling", () => {
    test("404: Should return 404 code and handle error when passed an invalid route", () => {
      return request(app)
        .get("/api/invalidRoute")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("That route does not exist");
        });
    });
  });
});
