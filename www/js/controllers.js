angular.module('digitel.controllers',[])

.controller('LocationCtrl', function($scope, $ionicLoading, $http) {
  $scope.locations=[];
  $http.get("http://aws02.impetuscr.com/appdigitel/AppWCF.svc/ObtenerLocales/JdvbEFJWJu5UVtk59")
  .then(function(response) {
    $scope.ubicaciones=[];
    $scope.ubicaciones=response.data.ObtenerLocalesResult;
    for (var i = 0 ; i <= $scope.ubicaciones.length -1; i++) {
      $scope.locations.push([$scope.ubicaciones[i].Descripcion,$scope.ubicaciones[i].DireccionCompleta,$scope.ubicaciones[i].Latitud,$scope.ubicaciones[i].Longitud]); 
    };
  }, function(response) {
    alert("No se ha podido conectar con el servidor. Comprueba tu conexión a Internet y vuelve a intentarlo")
  });
  var mapOptions = {
    center: new google.maps.LatLng(9.9356142,-84.1133451,13),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var whereamI =  '<div id="content">'+
  '<div id="siteNotice">'+
  '</div>'+
  '<div id="bodyContent">'+
  'Aquí estás'+
  '</div>'+
  '</div>';
  var infowindowMe = new google.maps.InfoWindow({
    content: whereamI
  });
  navigator.geolocation.getCurrentPosition(function(pos) {
    map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
    var myLocation = new google.maps.Marker({
      position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
      map: map
    });
    google.maps.event.addListener(myLocation, 'click', function() {
      infowindowMe.open(map,myLocation);
    });
    var marker,texto=[], i;
    var infowindow = new google.maps.InfoWindow(), marker, i;
    for (i = 0; i < $scope.locations.length; i++) {
      marker = new google.maps.Marker({
        position: new google.maps.LatLng($scope.locations[i][2], $scope.locations[i][3]),
        map: map
      });
      google.maps.event.addListener(marker, 'click', (function(marker, i) {
        return function() {
          infowindow.setContent('<h1 id="firstHeading" class="firstHeading">'+$scope.locations[i][0]+'</h1>' + $scope.locations[i][1]);
          infowindow.open(map, marker);
        }
      })(marker, i));
    };
  });
  $scope.map = map;
})
.controller('LoadingCtrl', function($scope,$timeout,$ionicLoading,$state,$localstorage,$rootScope,clientService) {
  $scope.loading = $ionicLoading.show({
    template: '<i class="icon ion-loading-a"></i>',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 50,
    showDelay: 0
  });
  $timeout(function () {
    if("idCliente" in localStorage){
      console.log("entra");
      $rootScope.idUsuario=$localstorage.get('idCliente');
      clienteExiste=clientService.get({id:$rootScope.idUsuario},function() {
        $ionicLoading.hide();
        if(!clienteExiste.ClienteResult.Error){
          if (clienteExiste.ClienteResult.AfiliacionAppCompleta){
            $state.go('tab.dash'); 
          }
          else {
            $state.go('pendingApproval');      
          };
        }else{
          alert(cliente.ClienteResult.MensajeError);
        }
      });
    } else {
      $state.go('login');
      $ionicLoading.hide();
    }
  }, 2000);
})
.controller('LoginCtrl', function($scope,$http,$resource,afiliatonService,$state,$rootScope,$localstorage,$ionicPopup) {
  var usuario;
  $scope.resultado="";
  if("Identificacion" in localStorage){
    $scope.idCliente=$localstorage.get('Identificacion');
  }
  $scope.logueo=function (user) {
    usuario = afiliatonService.get({id:user.id,correoCliente:user.email});

    usuario.$promise.then(function(result){
      $scope.resultado=usuario.AfiliacionResult.DescripcionRespuesta;       
      if (!usuario.AfiliacionResult.Error) {
        if (usuario.AfiliacionResult.AfiliacionExitosa){
          $localstorage.set('idCliente',usuario.AfiliacionResult.Cliente.IdCliente);
          $localstorage.set('Identificacion',usuario.AfiliacionResult.Cliente.Identificacion);
          $rootScope.idUsuario=$localstorage.get('idCliente');
          var confirmPopup=$ionicPopup.alert({
            title:'Atenci&oacute;n',
            template:"Se le acaba de enviar un correo electrónico para que confirme el proceso de afiliación"
          });
          confirmPopup.then(function(res) {
            if(res) {
              navigator.app.exitApp();
            }
          });
        }
      }else{
        alert(usuario.AfiliacionResult.MensajeError);
      }
    })
  }
})
.controller('OffersCtrl', function($scope,$http,$ionicLoading,$state,$rootScope){
  $scope.loading = $ionicLoading.show({
    template: '<i class="icon ion-loading-b"></i>Cargando Ofertas',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 50,
    showDelay: 0
  });
  $http.get("http://aws02.impetuscr.com/appdigitel/AppWCF.svc/ObtenerOfertasEnLinea/JdvbEFJWJu5UVtk59")
  .then(function(response) {
    $ionicLoading.hide();
    $scope.ofertas=response.data.ObtenerOfertasEnLineaResult;
  }, function(response) {
    $ionicLoading.hide();
    alert("No se ha podido conectar con el servidor. Comprueba tu conexión a Internet y vuelve a intentarlo")
  });
  $scope.regresar = function() {
    $state.go('offers', {}, {reload: true});
  };
  $scope.test=function(oferta){
    $rootScope.ofertaResultado={nombre:oferta.Nombre,imagenGrande:oferta.BannerPublicitario};
  }
})
.controller('DashCtrl',function($cordovaFileTransfer,$ionicLoading,$resource,$scope,$rootScope,$http,clientService,actualizarClienteService,desafiliarClienteService,actualizarFotoService,$localstorage,$state,$ionicPopup,limitToFilter){
  var colorCategoria="#ebebeb";
  $scope.html = "<a class='item item-icon-left' href='http://aws02.impetuscr.com/appdigitel/AppTerminosYCondiciones.html'><i class='icon ion-information-circled'></i>T&eacute;rminos y Condiciones</a>";
  $scope.loading = $ionicLoading.show({
    template: '<i class="icon ion-loading-b"></i>Cargando',
    animation: 'fade-in',
    showBackdrop: false,
    maxWidth: 50,
    showDelay: 0
  });
  var cliente=clientService.get({id:$rootScope.idUsuario});
  cliente.$promise.then(function(result){
    $ionicLoading.hide();
    $scope.puntos={
      puntosNombreCategoria:cliente.ClienteResult.ProgramaLealtadNombreCategoria,
      puntosAcumulados:cliente.ClienteResult.ProgramaLealtadPuntosAcumulados,
      puntosCanjeables:cliente.ClienteResult.ProgramaLealtadPuntosCanjeables,
      puntosCaducan:cliente.ClienteResult.ProgramaLealtadPuntosCaducanEn,
      puntosFinalCategoria:cliente.ClienteResult.ProgramaLealtadRangoFinalCategoria,
      puntosInicioCategoria:cliente.ClienteResult.ProgramaLealtadRangoInicioCategoria
    }
    $scope.cliente={
      nombreCliente:cliente.ClienteResult.Nombre, 
      mailCliente:cliente.ClienteResult.CorreoElectronico, 
      telefonoCliente:cliente.ClienteResult.TelefonoMovil,
      direccionCliente:cliente.ClienteResult.Direccion
    }
    if((cliente.ClienteResult.Foto).length > 1){
      $scope.cliente.foto=(cliente.ClienteResult.Foto);
    }else{
      $scope.cliente.foto=null;
    }
    colorCategoria=(cliente.ClienteResult.ProgramaLealtadColorCategoria); 

    var puntosGrafico=$scope.puntos.puntosAcumulados;
    if($scope.puntos.puntosFinalCategoria != -1){
      puntosGrafico=(puntosGrafico/$scope.puntos.puntosFinalCategoria)*100;  
    }else{
      puntosGrafico=100;
      $scope.puntos.puntosFinalCategoria='∞';
    };

    var puntosGraficoR=100-puntosGrafico; 
    $("#barcode").JsBarcode(cliente.ClienteResult.ProgramaLealtadNumeroClienteFrecuente,{displayValue:true,height:60});
    $scope.ideas = [
    {y: puntosGrafico,color:colorCategoria}, {y:puntosGraficoR,color:'#ebebeb'}
    ];
    $scope.points = limitToFilter($scope.ideas, 2);
  });
$scope.actualizarCliente=function (actualizar) { 
  actualizacion=actualizarClienteService.get({
    id:$rootScope.idUsuario,
    nombreCliente:actualizar.nombreCliente,
    correoCliente:actualizar.mailCliente,
    telCliente:actualizar.telefonoCliente,
    dirCliente:actualizar.direccionCliente
  });
  uploadPhoto(actualizar.foto);
  $scope.cliente.nombreCliente=actualizar.nombreCliente;
  $ionicPopup.alert({
    title:'Atenci&oacute;n',
    template:"Su perfil fue actualizado"
  })
};

$scope.regresar = function() {
  $state.go('profile', {}, {reload: true});
};

$scope.getNewPhoto = function() {
  navigator.camera.getPicture(function(result) {
    $scope.cliente.foto=result;
  }, function(err) {
    console.err(err);
  },{
    destinationType : navigator.camera.DestinationType.FILE_URI,
    quality:2
  });
};
$scope.getOldPhoto = function() {
  navigator.camera.getPicture(function(result) {
    $scope.cliente.foto=result;
  }, function(err) {
    console.err(err);
  },{
    destinationType : navigator.camera.DestinationType.FILE_URI,
    sourceType : navigator.camera.PictureSourceType.PHOTOLIBRARY,
    quality:2
  });
};
function uploadBlobOrFile(blobOrFile) 
{
  var xhr = new XMLHttpRequest(); 
  xhr.open('POST', 'http://54.183.76.52/AppDigitel/AppWCF.svc/CambiarFotoCliente/5263/key/JdvbEFJWJu5UVtk59', true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      console.log(xhr.responseText);
    }
  };
  xhr.send(blobOrFile);
}

function upload(uri) {
  console.log(uri);
  var options = {
    fileKey: "avatar",
    fileName: "avatar.jpg",
    chunkedMode: false,
    mimeType: "image/*"
  };
  $cordovaFileTransfer.upload("http://54.183.76.52/AppDigitel/AppWCF.svc/CambiarFotoCliente/5263/key/JdvbEFJWJu5UVtk59", uri, options).then(function(result) {
    console.log("SUCCESS: " + JSON.stringify(result.response));
  }, function(err) {
    console.log("ERROR: " + JSON.stringify(err));
  }, function (progress) {
            // constant progress updates
          });
}

function uploadPhoto(imageURI) {
  var options = new FileUploadOptions();
  options.fileKey="file";
  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
  options.mimeType="image/*";

  var params = new Object();
  params.value1 = "test";
  params.value2 = "param";

  // options.params = params;

  var ft = new FileTransfer();
  ft.upload(imageURI, "http://54.183.76.52/AppDigitel/AppWCF.svc/CambiarFotoCliente/5263/key/JdvbEFJWJu5UVtk59", win, fail, options);
}

function win(r) {
  console.log("Code = " + r.responseCode);
  console.log("Response = " + r.response);
  console.log("Sent = " + r.bytesSent);
}

function fail(error) {
  console.log("Upload error code " + error.code);
  console.log("upload error source " + error.source);
  console.log("upload error target " + error.target);
}
})
.controller('PointsCtrl',function($resource,$scope,$rootScope,$http,$state,historicoPuntosService){
  puntosCliente=historicoPuntosService.get({id:$rootScope.idUsuario},function(){
    $scope.puntos = puntosCliente.ObtenerProgramaLealtadMovimientoPuntosResult;
  });
  $scope.regresar = function() {
    $state.go('profile', {}, {reload: true});
  };
});

