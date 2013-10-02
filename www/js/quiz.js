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
				//$.mobile.changePage("quizList.htlm");
	    	} else {
	    		var html = '<br><h2>No tiene ha creado ninguna encuesta</h2>';
	    		$('#quizList').html(html);
	    	}
	    },
	    error: function(){
	    	notificationAlert('#alertWindow', "#indexHeader", "flip", "#messageAlert", "Problemas con el servidor. Intentelo nuevamente");
			var html = '<a id="refresh" data-icon="refresh-l" data-iconpos="left" onClick="quizList()">Resfrescar</a>';
			$('#quizList').html(html);
	    }
	});
	
};

function insertList(data){
	var html = '<h2>Encuestas:</h2><ul data-role="listview" class="ui-listview ui-listview-inset ui-corner-all ui-shadow">';
	for(var i=0;i < data.length;i++){
		if (parseInt(data[i].status)!=0){
			var color = parseInt(data[i].status) ==2?'#585858':'#FF4000';
			var fecha =  new Date(data[i].date*1000);
			var mes = parseInt(fecha.getMonth())+1;
			var dia = fecha.getDate()+"/" + mes.toString()+"/"+ fecha.getFullYear();
			var status = parseInt(data[i].status) ==2?'En proceso':' Terminada';
			html += '<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="c" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-c"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" class="ui-link-inherit" onClick="quizData('+ data[i].id +');" style="text-decoration:none;"> <p class="ui-li-aside ui-li-desc" style="color:'+ color +';">'+ status +'</p><h3 class="ui-li-heading">' + data[i].name + '</h3><p class="ui-li-desc">'+dia+'</p></a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>';
		}
	};
	html += '</ul>';
	return html;
};

function quizData(id){
	$.ajax({
	    url: "http://192.168.190.166/socratesprueba/mobile/detail?callback=?",
   	    type: "GET",
	    dataType: 'json',
   	    data: {"idquiz":id},
	    success: function(data){
	    	var html = questionList(data);
	    	var pagina = $( html );
	    	$("#alertWindow").remove();
	    	$("#footer").remove();
			pagina.appendTo( $.mobile.pageContainer );
			$.mobile.hidePageLoadingMsg()
			$.mobile.changePage( pagina );
        },
	    error: function(){
	    	notificationAlert('#alertWindow', "#indexHeader", "flip", "#messageAlert", "Intentelo nuevamente");
	    }
		
   	});
};



