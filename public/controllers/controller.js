var myApp = angular.module('boiler', ['ui.router', 'ui.bootstrap']);


//still trying to figure this out
myApp.factory('Auth', function(){
    var user;

    return{
        setUser : function(aUser){
            user = aUser;
        },
        isLoggedIn : function(){
            return(user)? user : false;
        }
      }
});

myApp.config(function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/news");

  $stateProvider
    .state('news', {
      url: "/news",
      templateUrl: "templates/news.html",
      params: {message : null}

    })
    .state('people', {
      url: "/people",
      templateUrl: "templates/people.html",
      resolve: { authenticate: authenticate },
    })
    .state('login', {
      url: "/login",
      templateUrl: "templates/login.html"
    })  
    .state('signup', {
      url: "/signup",
      templateUrl: "templates/signup.html"
    })        
    .state('preLogin', {
      url: "/preLogin",
      templateUrl: "templates/preLogin.html"
    });  

    function authenticate($q, Auth, $state, $timeout) {
      if (user.isAuthenticated()) {
        return $q.when()
      } else {
        $timeout(function() {
          $state.go('logInPage')
        })
        return $q.reject()
      }
    }
});

myApp.controller('navCtrl', ['$scope', '$location', '$http', function($scope, $location, $http) {
$scope.isActive = function (viewLocation) {
    console.log($location.url());
     var active = (viewLocation === $location.url());
     return active;
};
}]);

myApp.controller('loginCtrl', ['$scope', '$http', '$state', 'Auth', function($scope, $http, $state, Auth) {
   /*
    $scope.signup = function(){
        console.log($scope.local);
        $http.post('/signup', $scope.local).success(function(response){
            Auth.setUser(response);
            console.log('successful sign up!');
        });
    };

    $scope.login = function(){
        console.log($scope.local);
        $http.post('/login', $scope.local).success(function(response){
            Auth.setUser(response);
            console.log('successful login');
        });
    };
    */
}]);

myApp.controller('newsCtrl', ['$scope', '$http', 'Auth', '$state', function($scope, $http, Auth, $state) {
    console.log($state);
    console.log(Auth);
    $scope.isAddButtonDisabled = false;
    $scope.isUpdateButtonDisabled = true;


    var refresh = function(){
        $http.get('/news').success(function(response){
            console.log('I received data from GET');
            $scope.news = response;
        });
    };
    $scope.postNews = function(){
        $http.post('/news', $scope.newUpdate).success(function(response){
            console.log(response);
            $scope.newUpdate = "";
            refresh();
        });
    };
    $scope.deleteNews = function(id){
        $http.delete('/news/'+id).success(function(response){
        
            if($scope.isAddButtonDisabled == true){
                $scope.isAddButtonDisabled = false;
                $scope.isUpdateButtonDisabled = true;
                $scope.newUpdate = "";
            }
            refresh();
        
        });
    };

    $scope.editNews = function(id){
        $http.get('/news/'+id).success(function(response){
            console.log(response);
            $scope.newUpdate = response;
            $scope.isAddButtonDisabled = true;
            $scope.isUpdateButtonDisabled = false;
        });
    };

    $scope.updateNews = function(){
        console.log('!!!!');
        console.log($scope.newUpdate);
        $http.put('/news/' + $scope.newUpdate._id, $scope.newUpdate).success(function(response){
            $scope.newUpdate = "";  
            $scope.isAddButtonDisabled = false;
            $scope.isUpdateButtonDisabled = true;
            refresh();
        });
    };

    refresh();
}]);