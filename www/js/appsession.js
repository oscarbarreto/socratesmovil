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