const socketIo = require('socket.io');
const io = socketIo();

const socketApi =  { };
socketApi.io = io;

const users = { };

io.on('connection',(socket)=> {
    console.log('a user connected');
    socket.on('newUser',(data)=> {
        const defaultData = {
            id: socket.id,
            position: {
                x: 0,
                y:0
            }
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
        } catch (e) {
            console.log(e);
        }

    });
});


module.exports = socketApi;