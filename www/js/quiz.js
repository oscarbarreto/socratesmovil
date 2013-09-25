function quizList(){
	var idUser = window.localStorage.getItem('iduser');
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/list?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"iduser":idUser},
	    success: function(data){    
			if(data.length != 0){	    
	    		var html = insertList(data);
	    		pagina = $( html );
	    		pagina.appendTo("#content");
				$.mobile.hidePageLoadingMsg();
				//$.mobile.changePage( $.mobile.pageContainer );
	    	} else {
	    		var html = '<br><h2>No tiene ha hecho ninguna encuesta</h2>';
	    		$('#quizList').html(html);
	    	}
	    },
	    error: function(){
			alert('Problemas con el servidor. Intentelo nuevamente');
			var html = '<a id="refresh" data-icon="refresh-l" data-iconpos="left" onClick="quizList()">Resfrescar</a>';
			$('#quizList').html(html);
	    }
	});
	
};

function insertList(data){
	var html = '<h2>Encuestas:</h2><ul data-role="listview" data-inset="true" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">';
	for(var i=0;i < data.length;i++){
		html += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit" onClick="quizData('+ data[i].id +');" style="text-decoration:none;"><h3 class="ui-li-heading">' + data[i].name + '</h3><p class="ui-li-desc">'+data[i].date+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';
	};
	html += '</ul>';
	return html;
};

function quizData(code){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/quiz?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"code":code},
	    success: function(data){
	    /*if(id==0){
	    }
	    */
	    	var html = questionList(data);
	    	pagina = $( html );
	    	$("#content").empty();
	    	pagina.appendTo("#content");
			$.mobile.hidePageLoadingMsg();
        },
	    error: function(){
		alert('Intentelo nuevamente');
	    }
		
   	});
}

function questionList(data){
	var html = '<h2>'+data.name+'</h2>';
	
	/* if (data.questions[i].alternatives.length>0){
	
	} else {
		html = '<h3>La encuesta no tiene preguntas</h3>';
	}
	*/
	for(var i=0;i<data.questions.length;i++){
		html += '<div><div><h3>'+data.questions[i].name +'</h3><p>' + data.questions[i].help + '</p></div><div data-role="fieldcontain">';
		for (var j=0; j<data.questions[i].alternatives.length; j++){
			//textAux =  data.questions[i].alternatives[j].correct ==1 ? " &#10004;":""
			var x = j +1;
			html += '<p>'+x+') ' + data.questions[i].alternatives[j].name+' </p>';
		};
		html += '</div><div data-role="fieldcontain">';
		if ( data.questions[i].image.length>40 ){	
			html += '<img width="100%" src="' + data.questions[i].image + '">';
		};
		html += '</div></div>';
	};
	return html;
};

 