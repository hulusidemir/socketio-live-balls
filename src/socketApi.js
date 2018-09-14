const socketIo = require('socket.io');
const io = socketIo();

const socketApi =  {};
socketApi.io = io;
io.on('connection',(socket)=> {
    console.log('a user connected');
});


module.exports = socketApi;