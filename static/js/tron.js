"use strict";

console.log('Cargado juego.js');

//Constantes
const WIDTH = 1000;
const HEIGHT = 800;
const GRID_WIDTH = 50;
const GRID_HEIGHT = 50;

//Variables
var canvas;
var socket = io();	//Socket de comunicación con el servidor

window.onload = init;

function init(){
	canvas = document.getElementById('canvas');
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	canvas.ctx = canvas.getContext('2d');
	
	drawGrid();
	
	document.getElementById('btnRegister').onclick = register;
	
	socket.on('accepted', registerAccepted);
	socket.on('message', updateLog);
	socket.on('update', updateGrid);
	
	//Para enviar al chat
	window.onkeypress = keypressHandler;
	
	//Para mover la moto
	window.onkeydown = keydownHandler;
}

function drawGrid(){
	//Dibujamos el fondo
	canvas.ctx.beginPath();
	canvas.ctx.rect(0, 0, WIDTH, HEIGHT);
	canvas.ctx.fillStyle = "#09416C";
	canvas.ctx.fill();

	//Dibujamos las líneas de la parrilla
	for(let i = 1; i < WIDTH/GRID_WIDTH; i++){
		canvas.ctx.strokeStyle = '#8EB3D0';	//Establecemos el color de lí­nea
		canvas.ctx.lineWidth = 2;
		canvas.ctx.moveTo(i*GRID_WIDTH, 0);
		canvas.ctx.lineTo(i*GRID_WIDTH, HEIGHT);
		canvas.ctx.stroke();
	}
	for(let i = 1; i < HEIGHT/GRID_HEIGHT; i++){
		canvas.ctx.strokeStyle = '#8EB3D0';	//Establecemos el color de lí­nea
		canvas.ctx.lineWidth = 2;
		canvas.ctx.moveTo(0, i*GRID_HEIGHT);
		canvas.ctx.lineTo(WIDTH, i*GRID_HEIGHT);
		canvas.ctx.stroke();
	}

}

function updateGrid(players){
	//console.log(players)
	drawGrid()
	for (var id in players){
		var player = players[id]
		//console.log("name: " + player.name)
		//console.log("length: " + player.trace.length)
		canvas.ctx.fillStyle = player.color;
		for (let i = 1; i < player.trace.length; i++){
			var pointA = player.trace[i-1]
			var pointB = player.trace[i]
			var x = Math.min(pointA[0], pointB[0])
			var y = Math.min(pointA[1], pointB[1])
			var width = Math.max(5, Math.abs(pointB[0] - pointA[0]))
			var height = Math.max(5, Math.abs(pointB[1] - pointA[1]))
			//console.log("width: " + width + " ; height: " + height)
			canvas.ctx.fillRect(x, y, width, height)
			//console.log(x + ", " + y + ", " + width + ", " + height)
		}
	}
}

function keypressHandler(event){
	console.log('Pulsada tecla ' + event.keyCode)
	
	switch(event.keyCode){
		case 13:		//ENTER
			sendMessage()
			break;
	}
}

function keydownHandler(event){
	//console.log('Flecha: ' + event.keyCode)
	
	//TODO: Procesar solo si el jugador está registrado
	
	var turn = null
	switch(event.keyCode){
		case 37:		//	Left
			turn = 'l'
			break;
		case 38:		//	Up
			turn = 'u'
			break;
		case 39:		//	Right
			turn = 'r'
			break;
		case 40:		//	Down
			turn = 'd'
			break;
	}

	if (turn != null){
		socket.emit('turn', turn)
		//Evitamos que el evento siga
		event.preventDefault()
		event.stopPropagation()
	}
}

function register(event){
	console.log('Registrando Jugador');
	socket.emit('new', document.getElementById('name').value)
}

function sendMessage(event){
	socket.emit('message', document.getElementById('message').value)
	document.getElementById('message').value = '';
}

function registerAccepted(){
	console.log('Registro Aceptado');
	document.getElementById('pRegister').style.display = 'none';
	document.getElementById('chat').style.display = 'block';
}

function updateLog(data){
	var log = document.getElementById('log')
	log.innerHTML += data
	var maxScroll = log.lastChild.offsetTop
	log.scrollTop = maxScroll
}


function dibujar(img, x1Img, y1Img, x2Img, y2Img, xCanvas, yCanvas){
    canvas.ctx.drawImage(img, x1Img, y1Img, x2Img - x1Img, y2Img - y1Img, xCanvas, yCanvas, (x2Img - x1Img), (y2Img - y1Img));   
}
