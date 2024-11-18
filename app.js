const express = require('express')
const app = express()
const {getUsersByUsername} = require(`./controllers`)
const endpoints = require('./endpoints.json')
const { psqlErrorHandlerOne, psqlErrorHandlerTwo, psqlErrorHandlerThree, customErrorHandler, serverErrorHandler } = require("./error-handlers");

app.use(express.json())

app.get("/api", (request, response) => {
    response.status(200).send({endpoints})
  })

app.get('/api/users/:username', getUsersByUsername)

app.all("*", (request, response, next) => {
    response.status(404).send({msg: 'Path not found'})
})

app.use(psqlErrorHandlerOne);

app.use(psqlErrorHandlerTwo);

app.use(psqlErrorHandlerThree);

app.use(customErrorHandler);

app.use(serverErrorHandler);

module.exports = app;