const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json")
require('jest-sorted');

beforeEach(() => seed(data));

afterAll(() => db.end());

describe('app', () => {
    it('when invalid endpoint, give 404', () => {
       return request(app)
       .get('/api/non-existent-endpoint')
       .expect(404)
    })
})
describe("GET - /api/users/:username", () => {
    it("GET:200 - responds with a user object containing correct properties", () => {
        return request(app)
        .get("/api/users/nature_lover")
        .expect(200)
        .then(({ body }) => {
            expect(body.user).toHaveProperty('username', expect.any(String));
            expect(body.user).toHaveProperty('name', expect.any(String));
            expect(body.user).toHaveProperty('profile_img', expect.any(String));
            expect(body.user).toHaveProperty('points', expect.any(Number));
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

describe("GET - /api/posts", () => {
    it("GET:200 - responds with an array of posts with the correct properties", () => {
        return request(app)
        .get("/api/posts")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.posts)).toBe(true);
            expect(body.posts.length).not.toBe(0);
            body.posts.forEach(post => {
                expect(post).toHaveProperty('username', expect.any(String));
                expect(post).toHaveProperty('post_img', expect.any(String));
                expect(post).toHaveProperty('description', expect.any(String));
                expect(post).toHaveProperty('created_at', expect.any(String));
                expect(post).toHaveProperty('location', expect.any(Object));
            })
        })
    })
    it("GET:200 - responds with posts sorted by created_at in descending order", () => {
        return request(app)
        .get("/api/posts")
        .expect(200)
        .then(({ body }) => {
            expect(body.posts).toBeSortedBy('created_at', { descending: true });
        })
    })
    it("GET:200 - responds with posts sorted by created_at in ascending order", () => {
        return request(app)
        .get("/api/posts?sort_by=created_at&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body.posts).toBeSortedBy('created_at', { ascending: true });
        })
    })
    describe("Error handling", () => {
        it("GET:400 - returns an error when order is invalid", () => {
            return request(app)
            .get("/api/posts?sort_by=created_at&order=invalid_order")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid order query, must be either desc or asc' })
            })
        })
        it("GET:400 - returns an error when sort_by is invalid", () => {
            return request(app)
            .get("/api/posts?sort_by=invalid_column")
            .expect(({ body }) => {
                expect(body).toEqual({ msg: 'Query must be sort_by'})
            })
        })
    })  
})

describe("GET - /api/posts/:post_id", () => {
    it("GET:200 - responds with a post object containing correct properties", () => {
        return request(app)
        .get("/api/posts/1")
        .expect(200)
        .then(({ body }) => {
            expect(body.post).toHaveProperty('post_id', 1);
            expect(body.post).toHaveProperty('post_img', expect.any(String));
            expect(body.post).toHaveProperty('description', expect.any(String));
            expect(body.post).toHaveProperty('created_at', expect.any(String));
            expect(body.post).toHaveProperty('location', expect.any(Object));
       })
    })
    describe("Error handling", () => {
    it("GET:404 - returns an error for a non-existent post", () => {
        return request(app)
        .get("/api/posts/999")
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('No post found')
        })
    })
    it("GET:400 - returns an error for an invalid ID", () => {
        return request(app)
        .get("/api/posts/abcdefg")
        .expect(({ body }) => {
            expect(body.msg).toBe('Invalid type')
        })
    })
    })
})
describe("POST - /api/post", () => {
    it("POST:201 - adds a new post and returns it", () => {
        const newPost = {
        username: "nature_lover",
        post_img: "https://media.gettyimages.com/id/993489488/photo/peregrine-falcon-adult-female-warming-its-chicks-city-church-esslingen-baden-wuerttemberg.jpg?s=612x612&w=gi&k=20&c=FXlV3zDkpidzWObT8njwXc3AfexCEa3n8_mS89a-QaY=",
        description: "Check this new amazing Peregrine falcons' nest.",
        location: "(53.455645, 0.188402)"
        }
        return request(app)
        .post("/api/post")
        .send(newPost)
        .expect(201)
        .then(({ body }) => {
            expect(body.post).toEqual(expect.objectContaining({
                username: expect.any(String),
                post_img: expect.any(String),
                description: expect.any(String),
                location: expect.any(Object),
                created_at: expect.any(String),
                }))
            })
        })
    describe("Error handling", () => {
        it("POST:400 - returns an error if required fields are missing", () => {
        const newPost = {
            username: "nature_lover",
            description: "Check this new amazing Peregrine falcons' nest."
            }
            return request(app)
            .post("/api/post")
            .send(newPost)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Missing required fields'})
            })
        })
        it("POST:404 - returns an error for non-existent user", () => {
        const newPost = {
            username: "rand-user",
            post_img: "https://media.gettyimages.com/id/993489488/photo/peregrine-falcon-adult-female-warming-its-chicks-city-church-esslingen-baden-wuerttemberg.jpg?s=612x612&w=gi&k=20&c=FXlV3zDkpidzWObT8njwXc3AfexCEa3n8_mS89a-QaY=",
            description: "Check this new amazing Peregrine falcons' nest.",
            location: "(53.455645, 0.188402)"
        }
            return request(app)
            .post("/api/post")
            .send(newPost)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found'})
            })
        })
    })
})