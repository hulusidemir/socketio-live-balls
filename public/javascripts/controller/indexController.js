let controller = app.controller('indexController', ['$scope','indexFactory', ($scope,indexFactory) => {

    $scope.init = ()=> {
      const username = prompt('Lütfen Kullanıcı Adınızı Girin');
      if(username)
          initSocket(username);
      else
          return false;
    };

    function initSocket(username) {
        const connectionOptions = {
            reconnectionAttempts : 3,
            reconnectionDelay: 500
        };
        indexFactory.connectSocket('http://localhost:3000',connectionOptions).then((socket)=> {
            socket.emit('newUser', {username});
        }).catch((err)=> {
            console.log(err);
        });
    }
}]);