angular.module('digitel.services',[])

.factory('afiliatonService', function($resource) {
  return $resource('http://54.183.76.52/AppDigitel/AppWCF.svc/Afiliacion/:id/CorreoElectronico/:correoCliente/key/JdvbEFJWJu5UVtk59',{id:'@id',correoCliente:'@correoCliente'});
})

.factory('clientService',function($resource){
	return $resource('http://aws02.impetuscr.com/appdigitel/AppWCF.svc/Cliente/:id/key/JdvbEFJWJu5UVtk59',{id:'@id'});
})
.factory('actualizarClienteService',function($resource) {
	return $resource('http://aws02.impetuscr.com/appdigitel/AppWCF.svc/ActualizarCliente/:id/nombre/:nombreCliente/correoElectronico/:correoCliente/telefono/:telCliente/direccion/:dirCliente/Key/JdvbEFJWJu5UVtk59',{id:'@id',nombreCliente:'@nombreCliente',correoCliente:'@correoCliente',telCliente:'@telCliente',dirCliente:'@dirCliente'});
})
.factory('historicoPuntosService',function($resource){
	return $resource('http://aws02.impetuscr.com/appdigitel/AppWCF.svc/ConsultarPuntosIdCliente/:id/Key/JdvbEFJWJu5UVtk59',{id:'@id'});
})
.factory('desafiliarClienteService',function($resource){
	return $resource('http://54.183.76.52/Appdigitel/AppWCF.svc/Desafiliar/:id/Key/JdvbEFJWJu5UVtk59',{id:'@id'});
})
.factory('actualizarFotoService',function($resource){
	return $resource('http://54.183.76.52/AppDigitel/AppWCF.svc/CambiarFotoCliente/:id/foto/:foto/Key/JdvbEFJWJu5UVtk59',{id:'@id',foto:'@foto'});
});
