"use strict"

console.log('Cargado juego.js')

//Constantes
const WIDTH = 1000
const HEIGHT = 800
const GRID_WIDTH = 50
const GRID_HEIGHT = 50

//Variables
var canvas
var socket = io()	//Socket de comunicación con el servidor

window.onload = init

function init(){
	canvas = document.getElementById('canvas')
	canvas.width = WIDTH
	canvas.height = HEIGHT
	canvas.ctx = canvas.getContext('2d')
	
	drawGrid()
	
	document.getElementById('btnRegister').onclick = register
	
	socket.on('accepted', registerAccepted)
	
	window.onkeypress = keypressHandler
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

function keypressHandler(event){
	console.log('Pulsada tecla ' + event.keyCode);
	
}

function register(event){
	console.log('Registrando Jugador');
	socket.emit('new', document.getElementById('name').value)
}

function registerAccepted(){
	console.log('Registro Aceptado')
	document.getElementById('pRegister').style.display = 'none'
}

function dibujar(img, x1Img, y1Img, x2Img, y2Img, xCanvas, yCanvas){
    canvas.ctx.drawImage(img, x1Img, y1Img, x2Img - x1Img, y2Img - y1Img, xCanvas, yCanvas, (x2Img - x1Img), (y2Img - y1Img))  
}