const socketIo = require('socket.io');
const io = socketIo();

const socketApi =  {};
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
    });
    socket.on('disconnect',()=> {
        socket.broadcast.emit('disUser', users[socket.id]);
        delete users[socket.id];
        console.log(users);
    });
});


module.exports = socketApi;