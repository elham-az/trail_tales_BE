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

exports.fetchPosts = (sort_by = 'created_at', order = 'desc') => {
    const validSortBys = ['created_at']
    const validOrders = ['desc', 'asc']

    if(!validSortBys.includes(sort_by)) {
        return Promise.reject({status: 400, msg: 'Query must be sort_by'})
    }

    if(!validOrders.includes(order)) {
        return Promise.reject({status: 400, msg: 'Invalid order query, must be either desc or asc'})
    }

    const query = `SELECT * 
    FROM posts
    ORDER BY ${sort_by} ${order.toUpperCase()};` 

    return db.query(query)
    .then(({ rows }) => {
        if(rows.length === 0) {
            return Promise.reject({status: 404, msg: 'No post found' })
        }
        return rows;
    })
}