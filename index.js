//Constantes
const WIDTH = 1000
const HEIGHT = 800
const VEL = 3
const RATE = 1000 / 20

// Carga de dependencias (librerías)
var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')

// Variables globales
var app = express()			// Aplicación Express
var server = http.Server(app)	// Servidor HTTP
var io = socketIO(server)
var players = {}	//Es un objeto. Cada socket.id es una propiedad que contiene a un jugador
var numJug = 0		//Número de jugadores registrados
var dirs = ['u', 'r', 'd', 'l']
var colors = ['red', 'lightgreen', 'blue', 'yellow', 'pink', 'white', 'orange']

app.use(express.static('static'))

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'static/tron.html'))
})

// Iniciamos el servidor en el puerto 8080.
server.listen(8080, function () {
	var host = server.address().address
	var port = server.address().port
   
	console.log("Tron: Servidor iniciado en http://%s:%s", host, port)
})


// Manejadores de WebSockets.io
io.on('connection', function(socket) {
	socket.on('new', function(data) {
		console.log("Registrado nuevo jugador: " + data)
		
		//Creamos el nuevo jugador o le sobreescribimos is ya existe
		//players[socket.id] = {name : data};
		
		players[socket.id] = {
			name : data,
			trace : [[parseInt(Math.random() * (WIDTH-200) + 100), parseInt(Math.random() * (HEIGHT-200) + 100)]],
			color : colors[numJug % colors.length],
			dir : dirs[parseInt(Math.random() * dirs.length)]
		}
		//Insertamos la copia
		players[socket.id].trace.push([players[socket.id].trace[0][0], players[socket.id].trace[0][1]])
		
		var message = 'Se ha unido <strong>' + data + '</strong><br/>'
		socket.emit('accepted')				//Enviamos solo al cliente
		io.sockets.emit('message', message)	//Enviamos a todos
		numJug++
	})
	socket.on('message', function(data) {
		console.log("Recibido mensaje: " + data)
		if (players[socket.id]){	//Por si no existe el jugador (por reinicios){
			var message = '<strong>' + players[socket.id].name + ':</strong> ' + data + '<br/>'
			io.sockets.emit('message', message)	//Enviamos a todos
		}
	})
	socket.on('turn', function(dir){
		if (players[socket.id]){
			var player = players[socket.id]
			player.dir = dir
			var ultimaPosicion = player.trace[player.trace.length - 1]
			player.trace.push( [ultimaPosicion[0], ultimaPosicion[1]] )
		}
	})
})

//Envío de posiciones
setInterval(function() {
	updatePositions()
}, RATE)


function updatePositions(){
	for (var id in players){
		var player = players[id]
		var ultimaPosicion = player.trace[player.trace.length - 1]
		switch(player.dir){
			case 'u':
				ultimaPosicion[1] -= VEL
				break;
			case 'd':
				ultimaPosicion[1] += VEL
				break;
			case 'l':
				ultimaPosicion[0] -= VEL
				break;
			case 'r':
				ultimaPosicion[0] += VEL
				break;
		}
		//Detección de colisión con los bordes
		if (ultimaPosicion[0] <= 0     ||
			ultimaPosicion[0] >= WIDTH ||
			ultimaPosicion[1] <= 0	   ||
			ultimaPosicion[1] >= HEIGHT ){
			
			io.sockets.emit('message', 'MUERE ' + player.name)
			console.log('MUERE ' + player.name)
			delete players[id]
		}
	}
	io.sockets.emit('update', players)
}

