require('rconsole');
console.set(
	{	'facility' : 'local3',
		'title' : 'node-ncr',
		'syslogHashTags' : false			
	}
);

var daemon = require("daemonize2").setup(
	{	main: "network-card-reader.js",
		name: "Network Card Reader",
		pidfile: "node-ncr.pid"
	}
);

daemon.on(
	'error',
	function(err) {
		console.log("Error: " + err);
	}
);

switch (process.argv[2]) {

    case "start":
        daemon.start();
        break;

    case "stop":
        daemon.stop();
        break;

    default:
        console.log("Usage: [start|stop]");

}