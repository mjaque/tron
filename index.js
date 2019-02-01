// Carga de dependencias (librerías)
var express = require('express')
var http = require('http')
var path = require('path')
var socketIO = require('socket.io')

// Variables globales
var app = express()			// Aplicación Express
var server = http.Server(app)	// Servidor HTTP
var io = socketIO(server)

app.use(express.static('static'))

// Routing
app.get('/', function(request, response) {
	response.sendFile(path.join(__dirname, 'static/tron.html'))
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
		console.log("Registrado nuevo jugador: " + data)
		socket.emit("accepted")
	});
});

