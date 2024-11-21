const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const request = require("supertest");
const app = require("../app");
const endpoints = require("../endpoints.json")
require('jest-sorted');

// beforeEach(() => {
//     return db.query('SELECT PostGIS_Full_Version();').then(({ rows }) => {console.log(rows)
//         return seed(data)
//     });
// });

// afterEach(() => {
//     return db.query('SELECT PostGIS_Full_Version();').then(({ rows }) => console.log(rows));
// });

// afterEach(() => {
//     return db.query('SELECT * FROM posts;').then(({ rows }) => console.log());
// });

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('app', () => {
    it('when invalid endpoint, give 404', () => {
       return request(app)
       .get('/api/non-existent-endpoint')
       .expect(404)
    })
})

describe("GET - /api", () => {
    it("GET:200 - responds with endpoints object", () => {
        return request(app)
        .get("/api")
        .expect(200)
        .then(({ body }) => {
            expect(body).toEqual(endpoints)
        })
    })
})

describe("GET - /api/users", () => {
    it("GET:200 - responds with an array of users", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeInstanceOf(Array)
            expect(body.length).not.toBe(0)
            body.forEach(user => {
                expect(user).toHaveProperty('username', expect.any(String))
                expect(user).toHaveProperty('name', expect.any(String))
                expect(user).toHaveProperty('profile_img', expect.any(String))
                expect(user).toHaveProperty('points', expect.any(Number))
            })
        })
    })
    it("GET:200 - responds with users sorted by points in descending order", () => {
        return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('points', { descending: true });
        })
    })
    it("GET:200 - responds with users sorted by points in ascending order", () => {
        return request(app)
        .get("/api/users?sort_by=points&order=asc")
        .expect(200)
        .then(({ body }) => {
            expect(body).toBeSortedBy('points', { ascending: true });
        })
    })
    describe("Error handling", () => {
        it("GET:400 - returns an error when order is invalid", () => {
            return request(app)
            .get("/api/users?order=invalid_order")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid order query, must be either desc or asc' })
            })
        })
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

describe("GET - /api/postsByMap", () => {
    it("GET:200 - responds with an array of posts with area with the correct properties", () => {
        return request(app)
        .get("/api/postsByMap?longitude=-73.94581&latitude=40.807475")
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body.posts)).toBe(true);
            expect(body.posts.length).not.toBe(0);
            body.posts.forEach(post => {
                expect(post).toHaveProperty('username', expect.any(String));
                expect(post).toHaveProperty('post_img', expect.any(String));
                expect(post).toHaveProperty('description', expect.any(String));
                expect(post).toHaveProperty('created_at', expect.any(String));
                expect(post).toHaveProperty('location', expect.any(String));
            })
        })
    })
    it("GET:200 - responds with posts sorted by created_at in descending order", () => {
        return request(app)
        .get("/api/postsByMap?longitude=-73.94581&latitude=40.807475")
        .expect(200)
        .then(({ body }) => {
            expect(body.posts).toBeSortedBy('created_at', { descending: true });
        })
    })
    it("GET:200 - responds with posts sorted by created_at in ascending order", () => {
        return request(app)
        .get("/api/postsByMap?sort_by=created_at&order=asc&longitude=-73.94581&latitude=40.807475")
        .expect(200)
        .then(({ body }) => {
            expect(body.posts).toBeSortedBy('created_at', { ascending: true });
        })
    })
    describe("Error handling", () => {
        it("GET:400 - returns an error when order is invalid", () => {
            return request(app)
            .get("/api/postsByMap?sort_by=created_at&order=invalid_order&longitude=-73.94581&latitude=40.807475")
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid order query, must be either desc or asc' })
            })
        })
        it("GET:400 - returns an error when sort_by is invalid", () => {
            return request(app)
            .get("/api/postsByMap?sort_by=invalid_column&longitude=-73.94581&latitude=40.807475")
            .expect(({ body }) => {
                expect(body).toEqual({ msg: 'Invalid sort_by query'})
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
                expect(post).toHaveProperty('location', expect.any(String));
            })
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
                expect(body).toEqual({ msg: 'Invalid sort_by query'})
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
            expect(body.post).toHaveProperty('location', expect.any(String));
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
        location: "POINT(-73.94579 40.807472)",
        location_coord: "(-73.94579, 40.807472)"
        }
        return request(app)
        .post("/api/post?longitude=-73.94579&latitude=40.807472")
        .send(newPost)
        .expect(201)
        .then(({ body }) => {
            expect(body.post).toEqual(expect.objectContaining({
                post_id: expect.any(Number),
                username: expect.any(String),
                post_img: expect.any(String),
                description: expect.any(String),
                location: expect.any(String),
                created_at: expect.any(String),
                location_coord: expect.objectContaining({
                    x: expect.any(Number),
                    y: expect.any(Number),
                }),
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
            location: "POINT(-73.94579 40.807472)", 
            location_coord: "(-73.94579, 40.807472)"            
        }
            return request(app)
            .post("/api/post?longitude=-73.94579&latitude=40.807472")
            .send(newPost)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found'})
            })
        })
    })
})

describe("GET - /api/users/:username/favourites", () => {
    it("GET:200 - responds with an array of users's favourites", () => {
        return request(app)
        .get("/api/users/nature_lover/favourites")
        .expect(200)
        .then(({ body }) => {
            expect(body.favourites).toBeInstanceOf(Array)
            expect(body.favourites.length).not.toBe(0)
            body.favourites.forEach(favourite => {
                expect(favourite).toHaveProperty('username', expect.any(String))
                expect(favourite).toHaveProperty('post_img', expect.any(String))
                expect(favourite).toHaveProperty('description', expect.any(String))
                expect(favourite).toHaveProperty('created_at', expect.any(String))
                expect(favourite).toHaveProperty('location', expect.any(String))
                expect(favourite).toHaveProperty('location_coord', expect.objectContaining({
                    x: expect.any(Number),
                    y: expect.any(Number),
                }))
            })
        })
    })
    describe("Error handling", () => {
        it("GET:404 - returns an error for a user with no favourites", () => {
            return request(app)
            .get("/api/users/adventure_jane/favourites")
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('User has no favourites')
            })
        })
    })
})

describe("POST - /api/users/:username/favourites", () => {
    it("POST:201 - adds post to user's favourites", () => {
        const newFavourite = {
        username: "nature_lover",
        post_id: 3
        }
        return request(app)
        .post("/api/favourites")
        .send(newFavourite)
        .expect(201)
        .then(({ body }) => {
            expect(body.favouriteData).toEqual(expect.objectContaining({
                username: expect.any(String),
                post_id: expect.any(Number)
                }))
            })
        })
    describe("Error handling", () => {
    it("POST:404 - returns an error for non-existent user", () => {
        const newFavourite = {
            username: "non_existent_user",
            post_id: 3}
            return request(app)
            .post("/api/favourites")
            .send(newFavourite)
            .expect(404)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Not found'})
        })
    })
    it("POST:400 - returns an error if required fields are missing", () => {
        const newFavourite = {
            username: "nature_lover"}
            return request(app)
            .post("/api/favourites")
            .send(newFavourite)
            .expect(400)
            .then(({ body }) => {
                expect(body).toEqual({ msg: 'Missing required fields'})
            })
        })
    })
})