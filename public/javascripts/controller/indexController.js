let controller = app.controller('indexController', ['$scope','indexFactory','configFactory', ($scope,indexFactory,configFactory) => {

    $scope.init = ()=> {
        const username = prompt('Lütfen Kullanıcı Adınızı Girin');
        if(username)
            initSocket(username);
        else
            return false;
    };
    $scope.messages = [ ];
    $scope.players = {};

    function scrollTop() {
        setTimeout(()=> {
            const element = document.querySelector('#chat-area');
            element.scrollTop = element.scrollHeight;
        });
    }

    function showBubble(id, message) {
        $('#' + id).find('.message').show().html(message);
        setTimeout(()=> {
            $('#' + id).find('.message').hide()
        }, 2000);
    }
    async function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts: 3,
            reconnectionDelay: 500
        };
        try {

            const socketUrl = await configFactory.getConfig();
            const socket = await indexFactory.connectSocket(socketUrl.data.socketUrl, connectionOptions);
            socket.emit('newUser', {username});
            socket.on('initPlayer', (players) => {
                $scope.players = players;
                $scope.$apply();
            });
            socket.on('newUserLogin', (data) => {
                const messageData = {
                    type: {
                        code: 0, // server or user message
                        message: 1 //login or disconnect message
                    },
                    username: data.username
                };
                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                scrollTop();
                $scope.$apply();
            });
            socket.on('disUser', (user) => {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },
                    username: user.username
                };
                $scope.messages.push(messageData);
                delete $scope.players[user.id];
                scrollTop();
                $scope.$apply();

            });


            socket.on('animateFront', data => {
                $('#' + data.socketId).animate({'left': data.x, 'top': data.y}, () => {
                    animate = false;
                });
            });

            socket.on('newMessage', (data) => {
                $scope.messages.push(data);
                $scope.$apply();
                scrollTop();
                showBubble(data.socketId, data.text);
            });


            let animate = false;
            $scope.onClickPlayer = ($event) => {
                if (!animate) {
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit('animate', {x, y});


                    animate = true;
                    $('#' + socket.id).animate({'left': x, 'top': y}, () => {
                        animate = false;

                    });
                }
            };
            $scope.newMessage = () => {
                let message = $scope.message;
                const messageData = {
                    type: {
                        code: 1, // server or user message
                    },
                    username: username,
                    text: message
                };

                $scope.messages.push(messageData);
                $scope.message = '';

                socket.emit('newMessage', messageData);
                showBubble(socket.id, message);
                scrollTop();


            }
        } catch (e) {
            console.log(e);
        }
    }
}]);