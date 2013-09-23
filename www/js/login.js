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
		    	$.session.set("iduser", data.id);
		    	$.session.set("name", data.name);
	    		$.session.set("lastname", data.lastname);
	    		$.session.set("email", data.email);
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
