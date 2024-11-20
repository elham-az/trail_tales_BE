const db = require('../db/connection')

exports.fetchUsersByUsername = (username) => {
    return db.query(
        `SELECT *
        FROM users
        WHERE username = $1`,
        [username] 
    )
    .then(({rows}) => {
        if (rows.length === 0) {
            return Promise.reject({status: 404, msg: 'User not found' })
        }
        return rows[0];
    })
}

exports.fetchPosts = (longitude, latitude, sort_by = 'created_at', order = 'desc') => {
    const validSortBys = ['created_at'];
    const validOrders = ['desc', 'asc'];

    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Invalid sort_by query'});
    }
    if(!validOrders.includes(order)) {
        return Promise.reject({status: 400, msg: 'Invalid order query, must be either desc or asc'});
    }

    const query = (`
        SELECT *
        FROM posts
        WHERE ST_DWithin(
            location, 
            ST_SetSRID(ST_MakePoint($1, $2), 4326), -- User's lat, lon converted to geometry
            10000 -- 10 km distance in meters
        )
        ORDER BY ${sort_by} ${order};`)

    return db.query(query, [longitude, latitude])
        .then(({ rows }) => {
            if (rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'No posts found within 10 km' });
            }
            return rows;
        });
};

exports.fetchPostById = (post_id) => {
    return db.query(
        `SELECT *
        FROM posts
        WHERE post_id = $1`,
        [post_id]
    )
    .then(({rows}) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No post found' })
        }
        return rows[0];
    })
}

exports.addPost = ({ username, post_img, description, location }) => {
    return db.query(`
        INSERT INTO posts (username, post_img, description, created_at, location)
        VALUES ($1, $2, $3, NOW(), $4)
        RETURNING *;`,
         [username, post_img, description, location])
        .then(({ rows }) => {
            return rows[0]
    })
}