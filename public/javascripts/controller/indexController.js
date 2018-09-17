let controller = app.controller('indexController', ['$scope','indexFactory', ($scope,indexFactory) => {

    $scope.init = ()=> {
      const username = prompt('Lütfen Kullanıcı Adınızı Girin');
      if(username)
          initSocket(username);
      else
          return false;
    };
    $scope.messages = [ ];

    function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts : 3,
            reconnectionDelay: 500
        };
        indexFactory.connectSocket('http://localhost:3000',connectionOptions).then((socket)=> {
            socket.emit('newUser', {username});
            socket.on('newUserLogin',(data)=> {
               const messageData = {
                   type: {
                       code: 0, // server or user message
                       message: 1 //login or disconnect message
                   },
                   username: data.username
               };
               $scope.messages.push(messageData);
               $scope.$apply();
            });
            socket.on('disUser',(user)=> {
                const messageData = {
                    type: {
                        code: 0,
                        message: 0
                    },
                    username: user.username
                };
                $scope.messages.push(messageData);
                $scope.$apply();
            });
        }).catch((err)=> {
            console.log(err);
        });
    }
}]);