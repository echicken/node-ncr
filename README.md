# node-ncr
A network card reader server for node.js.  (HID USB card readers, RFID, magstripe.)

This is mostly for my own use, but if it benefits you ... so be it.

Installation is done like so:

'''sh
git clone https://github.com/echicken/node-ncr.git
cd node-ncr
npm install
'''

Configuration is done near the top of network-card-reader.js:

'''js
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
'''

Running the server is done like this:

'''sh
node index.js start
'''

Stopping the server is done like this:

'''sh
node index.js stop
'''

I intend to run this on the suckiest Ubuntu box that I can scrounge up.  Not sure how it would fare on other distros/platforms.