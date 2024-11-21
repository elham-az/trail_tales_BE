const {fetchUsers, fetchUsersByUsername, fetchPosts, fetchPostById, addPost} = require('../models/models')

exports.getUsers = (request, response, next) => {
    fetchUsers()
    .then((users) => {
        response.status(200).send(users)
    })
    .catch(next)
}

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
    const { longitude, latitude, sort_by, order } = request.query;
    
    if (!latitude || !longitude) {
        return response.status(400).send({ msg: 'Latitude and longitude are required' });
    }
    if (
        isNaN(latitude) || isNaN(longitude) ||
        latitude < -90 || latitude > 90 ||
        longitude < -180 || longitude > 180
    ) {
        return response.status(400).send({ msg: 'Invalid latitude or longitude values' });
    }

    fetchPosts( longitude, latitude, sort_by, order)
        .then((posts) => {
            response.status(200).send({ posts });
        })
        .catch(next);
};

exports.getPostById = (request, response, next) => {
    const {post_id} = request.params
    fetchPostById(post_id)
    .then((post) => {
        response.status(200).send({post})
    })
    .catch(next)
}

exports.postNewPost = (request, response, next) => {
    const { username, post_img, description, location, location_coord } = request.body;
    const { longitude, latitude } = request.query;

    if (!username || !description || !location || !location_coord) {
        return response.status(400).send({ msg: "Missing required fields" });
    }

    if (!longitude || !latitude) {
        return response.status(400).send({ msg: "Longitude and latitude are required" });
    }

    const formattedLocation = `POINT(${longitude} ${latitude})`;

    const newPost = {
        username,
        post_img,
        description,
        location: formattedLocation,
        location_coord
    };
    addPost(newPost)
        .then((addedPost) => {
            response.status(201).send({ post: addedPost })
        })
        .catch(next);
}