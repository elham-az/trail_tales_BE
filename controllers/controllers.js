const {fetchUsers, fetchUsersByUsername, fetchPostsByMap, fetchAllPosts, fetchPostById, addPost, fetchUserFavourites, addUserFavourites, updateUser, deletePostModel, deleteFavouriteModel} = require('../models/models')

exports.getUsers = (request, response, next) => {
    const { sort_by, order } = request.query;
    fetchUsers(sort_by, order)
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

exports.getPostsByMap = (request, response, next) => {
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

    fetchPostsByMap( longitude, latitude, sort_by, order)
        .then((posts) => {
            response.status(200).send({ posts });
        })
        .catch(next);
};

exports.getAllPosts = (request, response, next) => {
    const { sort_by, order } = request.query
    fetchAllPosts(sort_by, order)
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

exports.getUserFavourites = (request, response, next) => {
    const { username } = request.params;
    
    fetchUserFavourites(username)
    .then((favourites) => {
        response.status(200).send({favourites})
    })
    .catch((error) => {
        next(error)
    })
}

exports.postUserFavourites = (request, response, next) => {
    const { username, post_id } = request.body;

    if (!username || !post_id) {
        return response.status(400).send({ msg: "Missing required fields" });
    }
    
    const newFavourite = {
        username,
        post_id
    }

    addUserFavourites(newFavourite)
    .then((favouriteData) => {
        response.status(201).send({ favouriteData })
    })
    .catch((error) => {
    next(error)
    })
}

exports.patchUser = (request, response, next) => {
    const { username } = request.params
    const { name, profile_img, points } = request.body
  
    updateUser(username, name, profile_img, points)
      .then((updatedUser) => {
        response.status(200).send({ user: updatedUser });
      })
      .catch((error) => {
        next(error)
    })
}

exports.deletePost = (request, response, next) => {
    const {post_id} = request.params;

    deletePostModel(post_id)
        .then(() => {
            response.status(204).send()
        })
        .catch((error) => {
            next(error)
        })
}

exports.deleteFavourite = (request, response, next) => {
    const { username, post_id } = request.params;
    
    deleteFavouriteModel(username, post_id)
        .then(() => {
            response.status(204).send()
        })
        .catch((error) => {
            next(error)
        })
}

// exports.getUserFavourites = (request, response, next) => {
//     const { username } = request.params;

//     fetchUsers()
//     .then((users) => {
//         return users.map((validUser) => {
//             return validUser.username 
//         })
//     })
//     .then((validUser) => {
//         return fetchUserFavourites(username, validUser)
//     .then((favourites) => {
//         response.status(200).send({favourites})
//     })
//     })    
//     .catch((error) => {
//         next(error)
//     })
// }


