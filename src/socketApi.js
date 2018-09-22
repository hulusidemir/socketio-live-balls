const socketIo = require('socket.io');
const io = socketIo();

const socketApi =  { };
socketApi.io = io;

const users = { };

//helpers
const randomColor = require('../helpers/randomColor');

io.on('connection',(socket)=> {
    console.log('a user connected');
    socket.on('newUser',(data)=> {
        const rndX = Math.randomNumber(0,400);
        const rndY = Math.randomNumber(0,400);
        const defaultData = {
            id: socket.id,
            position: {
                x: rndX,
                y:rndX
            },
            color : randomColor()
        };
        const userData = Object.assign(data,defaultData);
        users[socket.id] = userData;
        socket.broadcast.emit('newUserLogin', users[socket.id]);
        socket.emit('initPlayer',users);

    });
    socket.on('disconnect',()=> {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
    });
    socket.on('animate',(data)=> {
        try {
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;

            socket.broadcast.emit('animateFront', {
                socketId : socket.id,
                x : data.x,
                y : data.y
            });
            console.log(users);
        } catch (e) {
            console.log(e);
        }

    });

    socket.on('newMessage',(data)=> {
        const messageData = Object.assign( {socketId : socket.id}, data);
        socket.broadcast.emit('newMessage', messageData);
    });
});


module.exports = socketApi;