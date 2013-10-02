var cabecera = '<div id="questionList" data-role="page" class="jqm-demos" data-quicklinks="true"><form name="myForm" id="myForm" method="POST" ><div id="indexHeader" data-role="header" data-position="fixed" class="jqm-header"><h1 class="jqm-logo">Sócrates PUCP</h1> <a href="#" data-position-to="origin" data-rel="popup" data-icon="back" class="ui-btn-right" data-corners="false" data-iconpos="notext" onclick="loginSession();"> </a></div><div data-role="content" class="jqm-content" id="questions"><div style="color:#FF0000;"><h2 id="errorQ"></h2></div>';
var footer = '</div><div data-role="footer" data-position="fixed"><div id="navbarFooter" data-role="navbar"><ul><li><a href="#questions" id="back" data-icon="arrow-l" class="ui-disabled"  data-iconpos="left" onClick="positionPage(false)">Atras</a></li><li><a href="#questions" id="next" data-icon="arrow-r " data-iconpos="right" class="ui-disabled" onClick="positionPage(true)">Siguiente</a></li></ul></div></div></form><div data-role="popup" id="alertQ" data-overlay-theme="a" data-theme="c" data-dismissible="false"><h3 class="ui-title">La encuesta no ha sido enviada, intentelo nuevamente</h3><a href="#" data-role="button" data-inline="true" data-theme="b" data-rel="back" data-mini="true" data-corners="false">Continuar</a></div></div>';

function validacionCode(idError){
	var errorAlert = (idError!=null && idError !="")?idError:"#errorMesage";
	code = document.getElementById("code").value;
	if( code == null || code.length == 0 || /^\s+$/.test(code) ) {
		$(errorAlert).empty();
		$(errorAlert).html('El campo Codigo no puede estar vacio');
	} else {
		codeTag(code);
	}
};

function codeQR(idError){
	var scanner = window.plugins.barcodeScanner;
	var errorAlert = (idError!=null && idError !="")?idError:"#alertWindow";
   	scanner.scan(
		function (result) {
			var x = result.text.lastIndexOf('/')
			var idRecord = result.text.substring(x+1);
			$.ajax({
          		url: "http://192.168.190.166/socratesprueba/mobile/quizQR?callback=?",
   	    		type: "GET",
	    		dataType: 'json',
	   	    	data: {"idrecord":idRecord},
		    	success: function(data){
					dataRequest(data);
        		},
	    		error: function(){
	    			notificationAlert('#alertWindow', "window", "flip", "#messageAlert", "Ocurrio un problema, intentelo nuevamente");
					//alert('Intentelo nuevamente');
	    		}
			});
		}, 
		function (error) {
			notificationAlert('#alertWindow', "window", "flip", "#messageAlert", "No se pudo obetener código QR");
		});
};


function codeTag(code){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/quiz?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"code":code},
	    success: function(data){
	    	dataRequest(data);
        },
	    error: function(){
	    	document.getElementById("code").value = '';
			$("#errorMesage").empty();
			$("#errorMesage").html('Ocurrio un error,intentelo nuevamente');
	    }
		
   	});

};

function dataRequest(data){
	if (data.id!=0){
		if (window.localStorage.getItem('iduser') == null){
			window.localStorage.setItem("iduser",0);
		}
		window.localStorage.setItem("idquiz",data.id);
		if ($('#questionList').length) {
 			$('#questionList').remove();
		}
		var html = insertHTML(data);
		var pagina = $( html );	
		pagina.appendTo( $.mobile.pageContainer );
		$.mobile.hidePageLoadingMsg()
		$.mobile.changePage( pagina );
	} else {
		document.getElementById("code").value = '';
		$("#errorMesage").empty();
		$("#errorMesage").html('La encuesta no esta disponible');
	}
};

function insertHTML(data){
	var html = cabecera+'<h2>'+data.name+'</h2><input type="hidden" name="numberQuestions" id="numberQuestions" value="' + data.questions.length +'"/><input type="hidden" name="position" id="position" value="0"/>';
		for(var i=0;i<data.questions.length;i++){
			var aux = i==0?"block":"none";
			html += '<div id="'+ i +'" style="display:'+ aux +'"><div><h3>'+data.questions[i].name +'</h3><p>' + data.questions[i].help + '</p></div><div data-role="fieldcontain"><fieldset>';
			var temp = data.questions[i].type=='0'?'radio':'checkbox';
			for (var j=0; j<data.questions[i].alternatives.length; j++){
				html += '<input type="'+ temp +'" name="'+ i +'" id="' + data.questions[i].alternatives[j].id + '" value="' + data.questions[i].alternatives[j].id + '" onclick="selectOption('+ i +');"><label for="' + data.questions[i].alternatives[j].id + '">' + data.questions[i].alternatives[j].name+'</label>';
			};
			html += '</fieldset></div><div data-role="fieldcontain">';
			if ( data.questions[i].image.length>40 ){	
				html += '<img width="100%" src="' + data.questions[i].image + '">';
			};
			html += '</div></div>';
		};
		//html += '<br><hr><div data-role="navbar"><ul><li><a id="back" data-icon="arrow-l" class="ui-disabled"  data-iconpos="left" onClick="positionPage(false)">Atras</a></li><li><a id="next" data-icon="arrow-r " data-iconpos="right" class="ui-disabled" onClick="positionPage(true)">Siguiente</a></li></ul></div>';
		html += footer;
		return html;
};

function positionPage(data){
	numberQuestions = document.getElementById("numberQuestions").value;
	positionQuestion = document.getElementById("position").value;
	
	if (parseInt(positionQuestion) == parseInt(numberQuestions)-1 && data){
		sentData();
	} else {
		divView = document.getElementById(positionQuestion);
		backButton = document.getElementById('back');
		divView.style.display = "none";
		if(parseInt(positionQuestion) == parseInt(numberQuestions)-2 && data){
			var text = '<span class="ui-btn-inner"><span class="ui-btn-text">Finalizar</span><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></span>';
			document.getElementById('next').innerHTML = text;
		} else if (parseInt(positionQuestion) == parseInt(numberQuestions)-1 && !data){
			var text = '<span class="ui-btn-inner"><span class="ui-btn-text">Siguiente</span><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></span>';
			document.getElementById('next').innerHTML = text;
			
		}
		if(parseInt(positionQuestion) == 1 && !data){
			var textClass = "ui-disabled ui-btn ui-btn-up-a ui-btn-inline ui-btn-icon-top";
			backButton.className = textClass;
		} else if (parseInt(positionQuestion) == 0 && data){
			var textClass = "ui-btn ui-btn-up-a ui-btn-inline ui-btn-icon-top";
			backButton.className = textClass;
		}
		positionQuestion = data ? parseInt(positionQuestion) +1: parseInt(positionQuestion) -1;
		document.getElementById("position").value = positionQuestion;
		divView = document.getElementById(positionQuestion.toString());
		divView.style.display = "block";
		selectOption(positionQuestion);
	}
	
};

function sentData(){
	var idUser = window.localStorage.getItem('iduser');
	var idQuiz = window.localStorage.getItem("idquiz");
	numberQuestions = document.getElementById("numberQuestions").value;
	var idAlternative='';
	var temp;
	var k = 0;
	for(var i=0;i<parseInt(numberQuestions);i++){
		var idQuestion = 'q' + i;
		alternativeElemnt = document.getElementsByName(i);
		for (var j=0;j < alternativeElemnt.length;j++){
			if(alternativeElemnt[j].checked){
				temp = k!=0?',':'';
				idAlternative += temp + alternativeElemnt[j].value;
				k++;
			}
		}
	}
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/save?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idencuesta":idQuiz,"answers":idAlternative,"iduser":idUser},
	    success: function(data){
	    	alert(data.id);
			if(data.id == '1'){
	    		window.localStorage.removeItem("idquiz");
	    		if (idUser=='0'){
	    		window.localStorage.removeItem("iduser");
	    		}
	    		if ($('#code').length) {
 					document.getElementById("code").value = '';
				}
	    		var html = '<br><h2>Ha terminado la encuesta</h2><div><a href="#" data-role="button" onclick="loginSession();">Regresar</a></div>';
	    		$('#navbarFooter').empty();
	    		$('#questions').html(html);
	    	} else {
	    		notificationAlert('#alertQ','#headerQ', 'flip');
	    	}	
	    },
	    error: function(){
	    	notificationAlert('#alertQ','#headerQ', 'flip');
	    }
	});
};

function selectOption(data){
	var temp = false;
	var textClass;
	alternativeElemnt = document.getElementsByName(data);
	for (var j=0;j < alternativeElemnt.length;j++){
		if(alternativeElemnt[j].checked){
		temp = true;
		}
	}
	textClass = temp?"ui-btn ui-btn-up-a ui-btn-inline ui-btn-icon-top":"ui-disabled ui-btn ui-btn-up-a ui-btn-inline ui-btn-icon-top";
	nextButton = document.getElementById('next');
	nextButton.className = textClass;
};

function notificationAlert(idN,positionN,transitionN,messageAlertN, messageN){
	$(idN).popup({ positionTo: positionN });
	$(idN).popup({ transition: transitionN });
	if (messageAlertN != '' && messageAlertN != null){
		$(messageAlertN).empty();
		$(messageAlertN).html(messageN);
	}
	$(idN).popup("open");
};

function questionList(data){
	var activateStatus =  parseInt(data[0].status) ==1?"block":"none";
	var stopStatus = parseInt(data[0].status) ==2?"block":"none";
	var fecha =  new Date(data[0].date*1000);
	var mes = parseInt(fecha.getMonth())+1;
	var dia = fecha.getDate()+"/" + mes.toString()+"/"+ fecha.getFullYear();
	var html = cabecera +'<div><div data-role="controlgroup" data-type="horizontal" class="ui-li-aside"><a href="#" id="activeQuiz" style="display:'+ activateStatus +'" data-role="button" onclick="statusChange('+ data[0].id +', true);" data-mini="true">Activar</a><a href="#" id="stopQuiz" style="display:'+ stopStatus +'" data-role="button" onclick="statusChange('+ data[0].id +',false);" data-mini="true">Terminar</a></div><div><h2>'+data[0].name+'</h2><p>'+dia+'</p>';
	if (data[0].questions.length>0){
		for(var i=0;i<data[0].questions.length;i++){
			var x = 97;
			html += '<div><div data-role="collapsible"><h3>'+data[0].questions[i].name +'</h3><p>' + data[0].questions[i].help + '</p><div data-role="fieldcontain">';
			for (var j=0; j<data[0].questions[i].alternatives.length; j++){
				textAux =  data[0].questions[i].alternatives[j].correct ==1 ? " &#10004;":""
				html += '<p>'+ String.fromCharCode(x)+') ' + data[0].questions[i].alternatives[j].name+'  <span style="color:#3ADF00;">'+textAux+' </span></p>';
				x++;
			};
			html += '</div><div data-role="fieldcontain">';
			if ( data[0].questions[i].image.length>40 ){	
				html += '<img width="100%" src="' + data[0].questions[i].image + '">';
			};
			html += '</div></div>';
		};
	} else {
		html += '<div><h3>La encuesta no tiene preguntas</h3><a href="#" data-role="button" onclick="loginSession();">Ir a encuestas</a></div>';
	}
	var footer2 = '</div><div data-role="footer" data-position="fixed"><div data-role="navbar"><ul><li><a href="#" class="ui-btn-active" onClick="codeQR('+"'#alertQuiz'"+');">QR</a></li><li><a href="#positionWindow" data-transition="flip"  data-position-to="#headerQ" data-rel="popup">Codigo</a></li></ul></div></div></form><div data-role="popup" id="positionWindow" data-theme="e" data-overlay-theme="a" class="ui-content"><form name="codeForm" id="codeForm" method="POST"><div><label for="code">Ingrese Codigo:</label><input name="code" id="code" value="" type="text" data-corners="false"></div><div><a href="#" data-role="button" data-theme="b" onclick="validacionCode('+"'#errorQ'"+');" data-rel="back">Continuar</a></div></form></div><div id="alertQuiz" data-role="popup" data-overlay-theme="a" data-theme="e" data-dismissible="false" class="ui-content"><h4 id="messageAlert"></h4><a href="#" data-role="button" data-inline="true" data-theme="b" data-rel="back" data-corners="false" style="text-align:center;">Continuar</a></div></div>';
	html+= footer2;
	return html;
};

function statusChange(idQuiz, actionQ){
	var styleActivate = actionQ?"none":"block";
	var status = actionQ?"1":"2";
	var styleStop = !actionQ?"none":"block";
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/status?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idencuesta":idQuiz,"status":status},
	    success: function(data){
	    	alert(data.id);
			if(data.id == '1'){
				stopQuiz = document.getElementById("stopQuiz");
				stopQuiz.style.display = styleStop;
				startQuiz = document.getElementById("activeQuiz");
				startQuiz.style.display = styleActivate;
	    	} else {
	    		$(errorAlert).empty();
				$(errorAlert).html('El campo Codigo no puede estar vacio');
	    	}	
	    },
	    error: function(){
	    	$(errorAlert).empty();
			$(errorAlert).html('El campo Codigo no puede estar vacio');
	    }
	});
	
};