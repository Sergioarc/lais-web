/*
	Controlador para ser usado en la barra de navegación (navbar) y que verifica si hay cambios en la URL.
	Esto es necesario para que el efecto parallax de la página inicial funcione correctamente con "ng-href",
	y para que funcione "href" en páginas distintas a la de inicio (por ejemplo: /eventos).
*/

angular.module('IndexCtrl',[]).controller('IndexController', function ($scope, $location,  $uibModal){
	$scope.$on('$locationChangeStart', function(event) { // Se ejecuta en cada cambio de URL
	    if($location.path() === '/') // Verificar si estamos en la página inicial
	    	$scope.isIndex = true; // Variable que se utiliza en la vista (index.html)
	    else
	    	$scope.isIndex = false;
	});

  	$scope.animationsEnabled = true; //Variable para hacer la animacion del modal

	//Función que inicializa y abre el modal con su respectivo template, asociado a un controlador
	$scope.open = function (size) {
		var modalInstance = $uibModal.open({
			animation: $scope.animationsEnabled,
		  	templateUrl: 'iniciasSesionModalContent.html',
		  	controller: 'AuthController'
		});
	};

	$scope.iniciarSesion = function (){
		console.log("Usuario");
	}
});

/*Controlador que le da la funcionalidad a lo que se ha declarado dentro del modal*/
angular.module('AuthCtrl',[]).controller('AuthController', function ($scope, $location, $uibModalInstance, Usuario){
	
	/*Funcion que inicia sesion y verifica si todo es correcto*/
	$scope.iniciarSesion = function (user, pass){
		console.log("Usuario");
		console.log(user);
		console.log(pass);
		Usuario.sign(
			{
				"username": user,
				"password": pass
			}
			).then(function (res){
				if(res.data.success){
					$scope.token = res.data.token;
					$scope.sesion = true;
					console.log("Toke",$scope.token);
					//localStorage
				}else{
					console.log("Usuario o Password incorrectos");
					$scope.sesion = true;
				}
				

			}, function (data, status){
				console.log("Error con el servidor");
			});
	};

});