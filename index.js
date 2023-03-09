const PORT = 8080;
const express = require('express');
const apiRouter = require('./api');
const server = express();
const morgan = require('morgan');
server.use(express.json());
const { client } = require('./db');
client.connect();

server.unsubscribe(express.json());

server.use('/api', apiRouter);

server.use((req, res, next) => {
    console.log("<____Body Logger START____>");
    console.log(req.body);
    console.log("<_____Body Logger END_____>");
  
    next();
});

server.listen(PORT, () => {
    console.log('The server is up on port', PORT);
})