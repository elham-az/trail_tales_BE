const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json")

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('app', () => {
    it('when invalid endpoint, give 404', () => {
       return request(app)
       .get('/api/non-existent-endpoint')
       .expect(404)
    })
    describe("GET - /api/users/:username", () => {
        it("GET:200 - responds with a user object containing correct properties", () => {
            return request(app)
            .get("/api/users/nature_lover")
            .expect(200)
            .then(({ body }) => {
                console.log(body)
                expect(body.user).toHaveProperty('username', expect.any(String));
                expect(body.user).toHaveProperty('name', expect.any(String));
                expect(body.user).toHaveProperty('profile_img', expect.any(String));
                expect(body.user).toHaveProperty('points', expect.any(Number));
           })
        })
    })
    describe("Error handling", () => {
        it("GET:404 - returns an error for a non-existent user", () => {
            return request(app)
            .get("/api/users/999")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User not found')
            })
        })
    })
})