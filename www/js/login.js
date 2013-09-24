function validacion(){
	$.mobile.allowCrossDomainPages = true;
	email = document.getElementById("email").value;
	password = document.getElementById("password").value;
	if( email == null || email.length == 0 || /^\s+$/.test(email) ) {
		alert("El campo Correo PUCP no puede estar vacío");
  		return false;
	} else if( password == null || password.length == 0 || /^\s+$/.test(password) ) {
  		alert("El campo Contraseña no puede estar vacío");
  		return false;
	} else if( !(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+/).test(email) ) {
  		alert("No es un correo válido");
  		return false;
	} else { 
		idUserTag(email,password);
		return true;
	}
};


function idUserTag(email,password){

	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/login?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"user":email,"pass":password},
	    success: function(data){
	    	if (data.id!=0){
	    		window.localStorage.setItem("iduser",data.id);
	    		window.localStorage.setItem("name",data.name);
	    		window.localStorage.setItem("lastname",data.lastname);
	    		window.localStorage.setItem("email",data.email);
	    		window.location.replace("quizlist.html");
		    } else {
	    		alert('El campo Correo PUCP o Contraseña es incorrecto');
	    	}
        },
	    error: function(){
		alert('El campo Correo PUCP o Contraseña es incorrecto');
	    }
		
   	});

};

function loginSession(){
 	if(checkLocalStorageSupport()){
 		var idUser = window.localStorage.getItem('iduser');
 		 if(idUser != null && idUser != 0){
 			window.location.replace("quizlist.html");
 		}
 	} else {
 		var db = window.openDatabase('Socrates', '1.0', 'Socrates', 200000);
 	}
};

function logoutSession(){
	window.localStorage.removeItem("iduser");
	window.localStorage.removeItem("name");
	window.localStorage.removeItem("lastname");
	window.localStorage.removeItem("email");
	window.location.replace("index.html");
};

/*document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {
        loginSession();
    }
*/
function checkLocalStorageSupport() {
	try {
		return 'localStorage' in window && window['localStorage'] != null;
	} catch (e) {
		return false;
	}
}
