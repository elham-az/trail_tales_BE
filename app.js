const express = require('express')
const app = express()
const { getUsers, getUsersByUsername, getPostsByMap, getPostById, postNewPost, getUserFavourites, postUserFavourites, getAllPosts, patchUser, deletePost, deleteFavourite, getAllPostsAndFavourites, getIsFavourited } = require(`./controllers/controllers`)
const endpoints = require('./endpoints.json')
const { psqlErrorHandlerOne, psqlErrorHandlerTwo, psqlErrorHandlerThree, customErrorHandler, serverErrorHandler } = require('./error-handlers');
const cors = require('cors')

app.use(cors())

app.use(express.json())

app.get('/api', (request, response) => {
    response.status(200).send(endpoints)
  })

app.get('/api/users', getUsers)

app.get('/api/users/:username', getUsersByUsername)

app.get('/api/postsByMap', getPostsByMap)

// app.get('/api/posts', getAllPosts)

// app.get('/api/posts/:post_id', getPostById)

app.post('/api/post', postNewPost)

app.get('/api/users/:username/favourites',getUserFavourites)

app.get('/api/posts/:username',getAllPostsAndFavourites)

app.get('/api/posts/:post_id/:username',getIsFavourited)

app.post('/api/favourites', postUserFavourites)

app.patch('/api/users/:username', patchUser);

app.delete('/api/posts/:post_id', deletePost)

app.delete('/api/users/:username/favourites/:post_id', deleteFavourite)

app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use(psqlErrorHandlerOne);

app.use(psqlErrorHandlerTwo);

app.use(psqlErrorHandlerThree);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;