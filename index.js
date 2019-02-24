//Constantes
const WIDTH = 1000;
const HEIGHT = 800;

// Carga de dependencias (librerías)
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

// Variables globales
var app = express();			// Aplicación Express
var server = http.Server(app);	// Servidor HTTP
var io = socketIO(server);
var players = {};				//Es un objeto. Cada socket.id es una propiedad que contiene a un jugador
var numJug = 0;					//Número de jugadores registrados
var colors = ['red', 'green', 'blue', 'yellow', 'pink', 'white', 'orange']
var dirs = ['u', 'r', 'd', 'l']	//Lista de direcciones

app.use(express.static('static'));

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'static/tron.html'));
});

// Iniciamos el servidor en el puerto 8080.
server.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Tron: Servidor iniciado en http://%s:%s", host, port)
})


// Manejadores de WebSockets.io
io.on('connection', function(socket) {
	socket.on('new', function(data) {
		console.log("Registrado nuevo jugador: " + data);
		
		players[socket.id] = {
			name : data,
			trace : [[parseInt(Math.random() * (WIDTH-200) + 100), parseInt(Math.random() * (HEIGHT-200) + 100)]],
			color : colors[numJug],
			dir : dirs[parseInt(Math.random() * dirs.length)]
		}
		
		var message = 'Se ha unido <strong>' + data + '</strong><br/>';
		socket.emit('accepted');				//Enviamos solo al cliente
		io.sockets.emit('message', message);	//Enviamos a todos
		numJug++;
	});
	socket.on('message', function(data) {
		console.log("Recibido mensaje: " + data);
		if (players[socket.id]){	//Por si no existe el jugador (por reinicios){
			var message = '<strong>' + players[socket.id].name + ':</strong> ' + data + '<br/>';
			io.sockets.emit('message', message);	//Enviamos a todos
		}
	});
	//TODO: socket.on('turn', function(data){});
});

//Envío de posiciones
setInterval(function() {
	//TODO: updatePositions()
	io.sockets.emit('state', players)
//}, 1000 / 10)
}, 2000)
