var net = require('net'),
	hid = require('hidstream'),
	rconsole = require('rconsole'),
	connections = [];

// Settings go here.
var allowedClients = [	// Array of IP addresses allowed to connect. (Strings)
		"127.0.0.1"
	],
	rfidReader = {
		'vendorId' : 3111,	// The Vendor ID of your card reader. (Number)
		'productId' : 15354 // The Product ID of your card reader. (Number)
	},
	port = 8124,	// The port you want to listen on. (Number)
	address = undefined; // The IP address to listen on. (String) (undefined == all)

var initServer = function() {

	var server = net.createServer(

		{ 'allowHalfOpen' : true },

		function(c) {

			if(allowedClients.indexOf(c.remoteAddress) < 0) {
				console.log(
					"Disconnecting unauthorized client %s",
					c.remoteAddress
				);
				c.end();
				return;
			}

			connections.push(c);
			console.log(c.remoteAddress + " connected");

			connections[connections.length - 1].on(
				'data',
				(function(index) {
					return function(data) {
						console.log(
							"%s: %s",
							connections[index].remoteAddress,
							data.toString().trim()
						);
					}
				})(connections.length - 1)
			);

			connections[connections.length - 1].on(
				'end',
				(function(index) {
					return function() {
						console.log(
							"%s disconnected",
							connections[index].remoteAddress
						);
						connections[index].end();
					}
				})(connections.length - 1)
			);

			connections[connections.length - 1].on(
				'error',
				(function(index) {
					return function(error) {
						console.log(
							"%s: Error: %s",
							connections[index].remoteAddress,
							error
						);
					}
				})(connections.length - 1)
			);

			connections[connections.length - 1].on(
				'close',
				(function(index) {
					return function() {
						connections.splice(index, 1);
					}
				})(connections.length - 1)
			);

		}

	);

	server.on(
		"error",
		function(err) {
			console.log("Server error: " + err);
			process.exit();
		}
	);

	server.listen(
		port,
		address,
		function() {
			console.log(
				'Listening on %s:8124 ...',
				(typeof address == "undefined") ? "*" : address
			);
		}
	);

}

var initLogs = function() {
	console.set(
		{	'facility' : 'local3',
			'title' : 'node-ncr',
			'syslogHashTags' : false			
		}
	);
}

var initRFID = function() {

	var broadcast = function(cn) {
		console.log("Broadcast: " + cn.trim());
		for(var c in connections)
			connections[c].write(cn);
	}

	var devices = hid.devices();
	var index = -1;
	for(var d = 0; d < devices.length; d++) {
		if(	devices[d].vendorId != rfidReader.vendorId
			||
			devices[d].productId != rfidReader.productId
		) {
			continue;
		}
		index = d;
		break;
	}

	if(index < 0) {
		console.log("RFID reader not found.");
		process.exit();
	}

	var RFID = new hid.device(
		devices[index].path,
		{ 'parser' : hid.parser.newline }
	);

	RFID.on("data", broadcast);

	process.on("exit", RFID.close);

}

var main = function() {
	initLogs();
	initRFID();
	initServer();
}

main();