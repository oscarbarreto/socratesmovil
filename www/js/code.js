var cabecera = '<div id="questionList" data-role="page" class="jqm-demos" data-quicklinks="true"><form name="myForm" id="myForm" method="POST" ><div data-role="header" data-position="fixed" class="jqm-header"><h1 class="jqm-logo">Sócrates PUCP</h1></div><div data-role="content" class="jqm-content" id="questions">';
var footer = '</div><div data-role="footer" data-position="fixed"><div id="navbarFooter" data-role="navbar"><ul><li><a href="#questions" id="back" data-icon="arrow-l" class="ui-disabled"  data-iconpos="left" onClick="positionPage(false)">Atras</a></li><li><a href="#questions" id="next" data-icon="arrow-r " data-iconpos="right" class="ui-disabled" onClick="positionPage(true)">Siguiente</a></li></ul></div></div></form></div>';

function validacionCode(){
	code = document.getElementById("code").value;
	if( code == null || code.length == 0 || /^\s+$/.test(code) ) {
		alert("El campo Codigo no puede estar vacio");
  		return false;
	} else {
		codeTag(code);
		return true;
	}
};

function codeQR(){
	var scanner = window.plugins.barcodeScanner;
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
					alert('Intentelo nuevamente');
	    		}
			});
      }, 
      function (error) {
          alert("No se pudo obetener código QR\n" + error);
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
		alert('Intentelo nuevamente');
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
		alert('La encuesta no se encuentra disponible');
	    window.location.replace("index.html");
	}
};

function insertHTML(data){
	var html = cabecera+'<h2>'+data.name+'</h2><input type="hidden" name="numberQuestions" id="numberQuestions" value="' + data.questions.length +'"/><input type="hidden" name="position" id="position" value="0"/>';
		for(var i=0;i<data.questions.length;i++){
			var aux = i==0?"block":"none";
			html += '<div id="'+ i +'" style="display:'+ aux +'"><div><h3>'+data.questions[i].name +'</h3><p>' + data.questions[i].help + '</p></div><div data-role="fieldcontain" data-demo-html="true"><fieldset data-role="controlgroup">';
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
		//var questionElement = document.getElementById(idQuestion).value;
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
			if(data.id == '1'){
	    		window.localStorage.removeItem("idquiz");
	    		if (idUser=='0'){
	    		window.localStorage.removeItem("iduser");
	    		}
	    		document.getElementById("code").value = '';
	    		var temp = idUser=='0'?'index.html':'quizlist.html';
	    		var html = '<br><h2>Ha terminado la encuesta</h2><div><a href="'+ temp +'" data-role="button">Regresar</a></div>';
	    		$('#navbarFooter').empty();
	    		$('#questions').html(html);
	    	} else {
	    		alert('La encuesta no ha sido enviada, intentelo nuevamente');
	    	}	
			/*pagina.appendTo( $.mobile.pageContainer );
			$.mobile.hidePageLoadingMsg()
			$.mobile.changePage( pagina );*/
	    },
	    error: function(){
			alert('La encuesta no ha sido envienda intentelo nuevamente');
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

