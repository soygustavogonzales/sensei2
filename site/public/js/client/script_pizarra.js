//Esperamos a que se cargue el dom para iniciar la aplicación
window.onload = function(){
	//init();
	canvasApp();

}

var l = console;
var plumon = {
	color:"#000",
	ancho:2,
	modo:true//modo plumon
};
//Comprobamos mediante la librería moderniz que el navegador soporta canvas
function canvasSupport(){
	var canvas = document.createElement('canvas');
	return (canvas.getContext)?true:false;
}

//Aquí englobo todo lo relacionado con la aplicación canvas.
function canvasApp() {

	//Si el navegador soporta canvas inicio la app.
	if(canvasSupport()){
		//console.log("Soporta canvas?: "+canvasSupport());
		var theCanvas = document.getElementById("canvas"),
			context = theCanvas.getContext("2d"),
			buttonClean = document.getElementById("clean");
			socket = io.connect('/');

		init();

	}

	function init(){

		//Dibujo la pizarra sin nada en su interior.
		clean();

		var click = false, //Cambia a true si el usuario esta pintando
			block = false; //Cambia a true si hay otro usuario pintando

		/* Las variables click y block funcionan de forma que cuando un usuario esta dibujando, 
		los demás deben esperar a que este termine el trazo para poder dibujar ellos */

		function clean(){
			//context.fillStyle = "green";
			theCanvas.width = theCanvas.width;
			//context.fillRect(0,0,theCanvas.width,theCanvas.height);

			//l.log("se ejecuto clean")
		}

		//Se inicia al trazo en las coordenadas indicadas.
		function startLine(e){
			l.log(plumon.color);
			l.log(window.colorPicker.value);
			context.beginPath();
			context.strokeStyle = ((plumon.modo)?window.colorPicker.value:plumon.color);
			l.log(context.strokeStyle)
			context.lineCap = "round";
			context.lineWidth = plumon.ancho||2;
				var x = e.pageX||e.clientX - theCanvas.offsetLeft,
								y = e.pageY||e.clientY - theCanvas.offsetTop;
								/*
								l.log(e.pageX+"---"+e.pageY);
								l.log(e.clientX+"---"+e.clientY);
								l.log(theCanvas.offsetLeft+"---"+theCanvas.offsetTop);
								*/
			context.moveTo(x, y);
		}

		//Se termina el trazo.
		function closeLine(e){
			context.closePath();
		}

		//Dibujamos el trazo recibiendo la posición actual del ratón.
		function draw(e){
			
			//context.strokeStyle = window.colorPicker.value||plumon.color||"#000";
				var x = e.pageX||e.clientX - theCanvas.offsetLeft,
								y = e.pageY||e.clientY - theCanvas.offsetTop;
			/*
											l.log(e.pageX+"---"+e.pageY);
											l.log(e.clientX+"---"+e.clientY);
											l.log(theCanvas.offsetLeft+"---"+theCanvas.offsetTop);
			*/
			context.lineTo(x,y);
			context.stroke();

		}

		//Usamos la librería socket.io para comunicarnos con el servidor mediante websockets
		socket.on('connect', function(){

			//Al darle click al botón limpiar enviamos orden de devolver la pizarra a su estado inicial.
			buttonClean.addEventListener("click",function(){
				l.log("click en CLEANER")
				if(!block){
					socket.emit('clean',true);
				}

			},false);

			//Al clickar en la pizarra enviamos el punto de inicio del trazo
			theCanvas.addEventListener("mousedown",function(e){
				var x = e.pageX||e.clientX,
								y = e.pageY||e.clientY;
								/*
								l.log(e.pageX+"---"+e.pageY);
								l.log(e.clientX+"---"+e.clientY);
								*/

				if(!block){
					socket.emit('startLine',{clientX : x, clientY : y});
					click = true;
					startLine(e);
				}

			},false);

			//Al soltar el click (dentro o fuera del canvas) enviamos orden de terminar el trazo
			window.addEventListener("mouseup",function(e){
				var x = e.pageX||e.clientX,
								y = e.pageY||e.clientY;
								/*
								l.log(e.pageX+"---"+e.pageY);
								l.log(e.clientX+"---"+e.clientY);
								*/

				if(!block){
					socket.emit('closeLine',{clientX : x, clientY : y});
					click = false;
					closeLine(e);
				}

			},false);

			//Al mover el ratón mientras esta clickado enviamos coordenadas donde continuar el trazo.
			theCanvas.addEventListener("mousemove",function(e){
					var x = e.pageX||e.clientX,
					y = e.pageY||e.clientY;


				if(click){
					if(!block){
						socket.emit('draw',{clientX : x, clientY : y});
						draw(e);
					}
				}

			},false);


			//Recibimos mediante websockets las ordenes de dibujo
			socket.on('down',function(e){
				if(!click){
					block = true;
					startLine(e);
				}
			});

			socket.on('up',function(e){
				if(!click){
					block = false;
					closeLine(e);
				}
			});

			socket.on('move',function(e){
				if(block){
					draw(e);
				}
			});
			
			socket.on('clean',clean);
			
		});//end socket

	}


}

/*Efectos en el DOM ************/
;!function(window,$,undefined){
		/**Tooltip de boorstrap*/
   $('#plumon').tooltip();//para q aparezca el tooltip cuando se produzca el hover sobre este elemento
   $('#eraserButton').tooltip();//para q aparezca el tooltip cuando se produzca el hover sobre este elemento
   $('#fullscreen').tooltip();
   $('#newRoom').tooltip();
		/***en tooltip*/
  var l = console;
	 var anchoVen = window.outerWidth; //el ancho(en pixeles) de la ventana del navegador(todos los navegadores), ultimas versiones
	 var altoVen = window.outerHeight;
	 var videoYou = document.querySelector("#you");
	 var dis_left_relative = 65;//distancia de la salida del trip(el contenedor del logotipo de cada modulo)
	 var dis_top_relative = 30;//distancia de la salida del trip(el contenedor del logotipo de cada modulo)
  $(function(){
  	var lateral = $('.lateral');
  	var lateral_content = $('.lateral > .content');
  		lateral.status = false;//esta retraido(como oculto)
  	lateral.css({
  		"left":(anchoVen-dis_left_relative)+"px",
  		"top":(0)+"px"
  	});
  	var trip = $('.trip');
  	/********/
  	/********/
  	trip.on("click",function(){
  		l.log("click");
  		var sentido = ((lateral.status==true)?"+":"-");
		 		lateral.animate({
		 			left:sentido+"=230px",
		 			opacity:"show"
		 		},800,function(){
		 			if(sentido=="-")
		 				lateral.status = true;//esta visible
		 			else
		 				lateral.status = false;//esta oculto

		 		});
  	});
  	trip.on("mouseenter",function(){
  		if(!lateral.status){

	  		l.log("mouseenter");
	  		lateral.animate({
	  			left:"-=10px"
	  		},205,function(){
	  			lateral.animate({left:"+=10px"},205)
	  			
	  		});
  		
  		}
  	});

  	var initVideo = function(){
				 /*
				 */
				 videoYou.width = lateral_content.width() - 100;
				 videoYou.height = lateral_content.height()/3;
				 videoYou.style.position = "relative";
				 videoYou.style.borderRadius = "5px";
				 videoYou.style.top = "15px";
				 videoYou.style.left = "15px";
				 videoYou.style.boxSizing = "border-box";

  	}
  		initVideo();
  	
  	$('canvas').on({
  		"mousedown" : function(e) {//cuando se de baje el boton del mouse
  				lateral.css({
  					"display":"none"
  				});
  		},
  		"mouseup": function (e) {//cuando se suelte el boton del mouse
  					lateral.css({
  					"display":"inline-block"
  				});
  		}  

  	});
  	$('#messages').mCustomScrollbar({
  		mouseWheel:true,
  		scrollButtons:{
  			enable:true,
  			scrollType:"continuous",
  			scrollSpeed:"auto",
  			scrollAmount:40
  		},
  		theme:"dark-2",
  		advanced:{
  			updateOnContentResize:true,
  			autoScrollOnFocus:true
  		}
  	})

  	$('#eraserButton').on('click',function(){
  		l.log("click en eraserButton")
  		plumon.color = "rgba(255,255,255,1)";//color blanco
  		plumon.ancho = 10;
  		plumon.modo = false;//modo borrador
  	})
  	/*
  	*/
  	window.colorPicker = document.querySelector('.colorPicker-plumon');
  	colorPicker.addEventListener("click",function(){
  		//l.log(this);
  		plumon.color = this.value;
  		plumon.ancho = 2;
  		l.log("click en colorPicker: "+ plumon.color + " : "+this.value);
  	},false);
  	
  	$('#plumon').on('click',function(){
  		plumon.modo = true;
				colorPicker.dispatchEvent(new MouseEvent('click'));//lanzo en evento, con codigo nativo de javascrip, pues con jquery me dio error
				//colorPicker.trigger('click');//forma comun de lanzar un evento mediante jquery

  	})
  	$(window).on("resize",function(){
  		//l.log("redimensionaste la ventana");
	 		var anchoVen = window.outerWidth; //el ancho(en pixeles) de la ventana del navegador(todos los navegadores), ultimas versiones
  		lateral.css({
  			"left":(anchoVen-dis_left_relative)+"px",
  			"top":(0)+"px"
  		});
  		lateral.status = false;
  		//l.log("lateral.status: "+lateral.status)
  	});
  })
		

  
}(window,jQuery,undefined);
