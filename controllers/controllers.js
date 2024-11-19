const {fetchUsersByUsername, fetchPosts, fetchPostById} = require('../models/models')

exports.getUsersByUsername = (request, response, next) => {
    const { username } = request.params;
    fetchUsersByUsername(username)
    .then((userData) => {
        response.status(200).send({user: userData})
    })
    .catch((error) => {
        next(error)
    })
}

exports.getPosts = (request, response, next) => {
    const { sort_by, order } = request.query
    fetchPosts(sort_by, order)
    .then((posts) => {
        response.status(200).send({ posts })
    })
    .catch(next)
}

exports.getPostById = (request, response, next) => {
    const {post_id} = request.params
    fetchPostById(post_id)
    .then((post) => {
        response.status(200).send({post})
    })
    .catch(next)
}