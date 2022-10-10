const request = require("supertest"),
  db = require("../db/connection.js"),
  app = require("../db/app.js");
const seed = require("../db/seeds/seed.js"),
  {
    categoryData,
    commentData,
    reviewData,
    userData,
  } = require("../db/data/test-data/index.js");

beforeEach(() => seed({ categoryData, commentData, reviewData, userData }));
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
});
