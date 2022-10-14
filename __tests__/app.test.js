const request = require("supertest"),
  db = require("../db/connection.js"),
  app = require("../db/app.js"),
  seed = require("../db/seeds/seed.js"),
  testData = require("../db/data/test-data/index.js"),
  jestSorted = require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("/api", () => {
  describe("Happy paths", () => {
    describe("/categories", () => {
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
      test("Should accept a query for category to filter the reviews by", () => {
        return request(app)
          .get("/api/reviews?category=dexterity")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toHaveLength(1);
            expect(reviews[0]).toEqual({
              title: "Jenga",
              designer: "Leslie Scott",
              owner: "philippaclaire9",
              review_img_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              review_body: "Fiddly fun for all the family",
              category: "dexterity",
              created_at: "2021-01-18T10:01:41.251Z",
              comment_count: 3,
              votes: 5,
              review_id: 2,
            });
          });
      });
      test("Sort order should default to date", () => {
        return request(app)
          .get("/api/reviews")
          .expect(200)
          .then(({ body: { reviews } }) => {
            expect(reviews).toBeSortedBy("created_at", {
              decending: true,
              coerce: true,
            });
          });
      });
      test("Should accept any valid column to sort by", () => {
        const sortVotes = request(app)
          .get("/api/reviews?sort=votes")
          .expect(200)
          .then(({ body: { reviews } }) => {
            const votes = reviews.map((review) => review.votes),
              sortedVotes = [...votes].sort((a, b) => b - a);
            expect(votes).toEqual(sortedVotes);
          });
        const sortOwner = request(app)
          .get("/api/reviews?sort=owner")
          .expect(200)
          .then(({ body: { reviews } }) => {
            const owners = reviews.map((review) => review.owner),
              sortedOwners = [...owners].sort((a, b) => b - a);
            expect(owners).toEqual(sortedOwners);
          });
        return Promise.all([sortVotes, sortOwner]);
      });
      test("Should accept order query which defaults to DESC", () => {
        return request(app)
          .get("/api/reviews?sort=votes")
          .expect(200)
          .then(({ body: { reviews } }) => {
            const votes = reviews.map((review) => review.votes),
              sortedVotes = [...votes].sort((a, b) => b - a);
            expect(votes).toEqual(sortedVotes);
          });
      });
      test("Should accept order query to specify sort order", () => {
        const datesQuery = request(app)
          .get("/api/reviews?order=ASC")
          .expect(200)
          .then(({ body: { reviews } }) => {
            const dates = reviews.map((review) => new Date(review.created_at)),
              sortedDates = [...dates].sort((a, b) => a - b);
            expect(dates).toEqual(sortedDates);
          });
        const votesQuery = request(app)
          .get("/api/reviews?sort=votes&order=ASC")
          .expect(200)
          .then(({ body: { reviews } }) => {
            const votes = reviews.map((review) => review.votes),
              sortedVotes = [...votes].sort((a, b) => a - b);
            expect(votes).toEqual(sortedVotes);
          });
        return Promise.all([datesQuery, votesQuery]);
      });
      describe("/review_id", () => {
        test("GET: Should return a review object relating to the passed review_id", () => {
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
        describe("/review_id/comments", () => {
          test("Should return an array of all comments associated with passed review_id", () => {
            return request(app)
              .get("/api/reviews/2/comments")
              .expect(200)
              .then(({ body: { comments } }) => {
                expect(comments).toHaveLength(3);
                expect(
                  comments.forEach((comment) => {
                    expect(comment).toEqual(
                      expect.objectContaining({
                        comment_id: expect.any(Number),
                        body: expect.any(String),
                        votes: expect.any(Number),
                        author: expect.any(String),
                        review_id: expect.any(Number),
                        created_at: expect.any(String),
                      })
                    );
                  })
                );
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
    test("400: Should return when passed a category query that doesn't exist", () => {
      return request(app)
        .get("/api/reviews?category=pineapple")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("No such category");
        });
    });
    test("404: Should return when passed an invalid sort value", () => {
      return request(app)
        .get("/api/reviews?sort=invalidSortQuery")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid sort query");
        });
    });
    test("404: Should return when passed an invalid order value", () => {
      return request(app)
        .get("/api/reviews?order=invalidOrderQuery")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid sort query");
        });
    });
  });
});
