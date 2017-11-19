'use strict';
/**
 * Controller Socket
 */
// -------------------------------------------------------------------------- //
//                              Recuperation                                  //
// -------------------------------------------------------------------------- //
const socketio = require('socket.io');

module.exports.listen = (server, ServerEvent, colors) => {
	const io = socketio(server);
	
	console.log('Socket ready');
	
	// Broadcast NewPizza for all users
	ServerEvent.on('PizzaSaved', (data) => {
		console.log('Emit: myEvent');
		io.sockets.emit('NewPizza', data);
	});
	
	// On Open Socket
	io.sockets.on('connection', (socket) => {
		console.log(`Client Connecté: ${socket.id}`);
		
		socket.on('myEvent', (data) => {
			ServerEvent.emit('myEvent', data, socket);
			
		});
	});
};