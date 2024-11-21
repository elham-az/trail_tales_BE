const express = require('express')
const app = express()
const { getUsers, getUsersByUsername, getPosts, getPostById, postNewPost, getUserFavourites, postUserFavourites} = require(`./controllers/controllers`)
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

app.get('/api/posts', getPosts)

app.get('/api/posts/:post_id', getPostById)

app.post('/api/post', postNewPost)

app.get('/api/users/:username/favourites',getUserFavourites)

app.post('/api/favourites', postUserFavourites)

app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use(psqlErrorHandlerOne);

app.use(psqlErrorHandlerTwo);

app.use(psqlErrorHandlerThree);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;