require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const passport = require('passport');
const { get, routes } = require('./config');
const env = get();  // after you change it put parameter value
const app = express();
const router = express.Router();
const cors = require('cors');
const http = require('http').Server(app);
const io = require('socket.io')(http);
io.on('connection', (socket) => {
    console.log('user connected');
    socket.username = 'anonymouse';
    socket.on('new-message', (message) => {
        // console.log('arrrived', message)
        socket.emit('arrived_message', { data: message, username: socket.username });
        socket.broadcast.emit('arrived_message', { data: message, username: socket.username });
    });
    socket.on('final_result', (msg) => {
        // console.log('mmmmmmmmmmmmmmmmmmmm', msg);
        socket.emit('final_results', msg);
        socket.broadcast.emit('final_results', msg);
    })
});

mongoose.connect(env.database, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
    session({
        secret: env.sessionSecret,
        cookie: { secure: false, expires: 60 * 60 },
        resave: false,
        saveUninitialized: false,
    }),
);
const options = {
    origin: function (origin, callback) {
        callback(null, true)
    },
    credentials: true,
}
app.use(cors(options))
routes.forEach((route) => {
    app.use('/api', route.routes(router));
})
// app.listen(env.port, () => {
//     console.log('run app........', env.port);
// });
const server = http.listen(env.port, () => {
    console.log('server is running on port', server.address().port);
});



