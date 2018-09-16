const socketIo = require('socket.io');
const io = socketIo();

const socketApi =  {};
socketApi.io = io;

const users = [];

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
        users.push(userData);
        socket.broadcast.emit('newUserLogin', userData);
    });
});


module.exports = socketApi;