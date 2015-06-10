angular.module('digitel', ['ngCordova','ionic','ngResource','digitel.controllers', 'digitel.directives','digitel.services','ionic.utils','ngSanitize','dcbImgFallback'])

.run(function($ionicPlatform, $ionicPopup,$cordovaNetwork) {
  $ionicPlatform.ready(function() {
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
    if(!$cordovaNetwork.isOnline()){
      $ionicPopup.alert({
        title:'Atenci&oacute;n',
        template:"No se ha podido conectar con el servidor. Comprueba tu conexión a Internet y vuelve a intentarlo"
      }).then(function(res){
        if(res){
          navigator.app.exitApp();
          }
        })
    };  
  });
  $ionicPlatform.onHardwareBackButton(function(e) {
    e.preventDefault();
    if(true){
      $ionicPopup.confirm({
        title:'Atenci&oacute;n',
        template:"Desea salir de la aplicaci&oacute;n?"
      }).then(function(res){
        if(res){
          navigator.app.exitApp();
          }
        })
    }
  });
})

.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
  })

.config(function($stateProvider, $urlRouterProvider,$ionicConfigProvider) {
  $stateProvider
  .state('welcome',{
    url:"/welcome",
    templateUrl:'templates/welcome.html',
    controller:'LoadingCtrl'
  })
  .state('login', {
      url: "/login",
      templateUrl: "templates/login.html",
      controller: "LoginCtrl"
    })
  .state('pendingApproval',{
    url:'/pendingApproval',
    templateUrl:"templates/login-Pendiente.html",
    controller:"LoginCtrl"
  })
  .state('tab', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  .state('tab.locations', {
    url: '/locations',
    views: {
      'tab-locations': {
        templateUrl: 'templates/tab-locations.html',
        controller: 'LocationCtrl'
      }
    }
  })
  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('offers', {
    url: '/offers',
    parent:'tab',
    views: {
      'tab-offers': {
        templateUrl: 'templates/tab-offers.html',
        controller: 'OffersCtrl'
      }
    }
  })
  .state('offers.detail',{
    url:"/details",
    views:{
      'tab-offers@tab':{
        templateUrl:"templates/offer-Details.html",
        controller:'OffersCtrl'
      }
    }
  })
  .state('profile', {
    url: '/profile',
    parent: 'tab',
    views: {
      'tab-profile': {
        templateUrl: 'templates/tab-profile.html',
        controller: 'DashCtrl'
      }
    }
  })
  .state('profile.edit', {
      url: "/editProfile",
      views: {
        'tab-profile@tab': {
          templateUrl: "templates/edit-Profile.html",
          controller: 'DashCtrl'
        }
      }
    })
  .state('profile.points', {
      url: "/pointsRecord",
      views: {
        'tab-profile@tab': {
          templateUrl: "templates/points-Record.html",
          controller: 'PointsCtrl'
        }
      }
    });
  $urlRouterProvider.otherwise('/welcome');
  $ionicConfigProvider.tabs.position('bottom');
})