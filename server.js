const express = require('express'); // Import Express.js module
let io = require('socket.io'); // Import Socket.io module
const http = require('http'); // Import HTTP module
const rfb = require('rfb2'); // Import RFB module (VNC)
const rdp = require('node-rdpjs'); // Import RDP module
const Jimp = require('jimp'); //Import Jimp module (JavaScript counterpart of GNU Gimp)
const tunnel = require('tunnel-ssh'); // Import SSH tunneling features
const arg = process.argv[2]; // Entering port number from the command lines
process.setMaxListeners(100); //Allows handling of more event listeners.

const Params = {  // Parameter object for the server.
  httpPort: arg || 3000,  // Default port is 3000 if arguement not passed.
  connType: 'rfb', // Default connection type is VNC
  compType: 'comppng',  // Default compression type is PNG.
};

const app = express(); // Create object from express() constructor.
const server = http.createServer(app); // Create server from app object.
app.use(express.static(__dirname + '/public/')); // Set "public" as web page root

server.listen(Params.httpPort); // Server listens on arg or 3000
console.log('Server listening on port: ', Params.httpPort);
console.log("Start server again with 'node " + process.argv[1].split("/").slice(-1)[0] + " [PORT_NUMBER]' to change port.");
io = io.listen(server); // Start Websocket on the same page and port with the web server

io.sockets.on('connection', function (socket) { // Main Socket.io event
  console.log('Socket.io established...');
  socket.on('type', function (type) { // Socket.io listens for connection type changing events.
    Params.connType = type.conn; // Changes compression type.
    console.log('Connection type changed to: ' + Params.connType);
  });
  socket.on('comp', function (comp) { // Socket.io listens for connection type changing events.
    Params.compType = comp.comp; // Changes compression type.
    console.log('Compression type changed to: ' + Params.compType);
  });
  socket.on('remote', function (config) { // Socket.io waits for user credentials.
    if (Params.connType == 'rfb') {
      // Creates VNC connection.
      let rfbClient = createRfbConnection(config, socket);
      rfbSocketHandler(rfbClient, socket); // ADDS other handlers
    }
    if (Params.connType == 'rfbssh') {
      // Creates SSH tunneling.
      let sshTunnel = createSSHtunnel(config);
      sshTunnel.on('error', function () {
        console.log('SSH connection error!');
      })
      // Creates VNC connection.
      let rfbClient = createRfbConnection(config, socket);
      rfbSocketHandler(rfbClient, socket); // ADDS other handlers
    }
    if (Params.connType == 'rdp') {
      // Creates RDP connection.
      let rdpClient;
      if (rdpClient) {
        rdpClient.close(); // Close previous connection if exists.
      };
      rdpClient = createRdpConnection(config, socket);
      rdpSocketHandler(rdpClient, socket); // ADDS other handlers
    }
    if (Params.connType == 'rdpssh') {
      // Creates SSH tunneling and RDP connection.
      let rdpClient;
      let sshTunnel = createSSHtunnel(config);
      sshTunnel.on('error', function () {
        console.log('SSH connection error!');
      })
      rdpClient = createRdpConnection(config, socket);
      rdpSocketHandler(rdpClient, socket); // ADDS other handlers
    }
  });
});

function createSSHtunnel(config) { // SSH tunneling function
  let options = {
    username: config.sshusername, // SSH Username 
    password: config.sshpassword, // SSH Password
    host: config.host, // IP or hostname of the remote desktop
    port: config.sshport, // SSH port, default 22
    dstHost: '127.0.0.1', // Tunnelling will be binded locally
    dstPort: config.port, // Port of the blocked port
    localHost: '127.0.0.1', // Tunnelling will be binded locally
    localPort: config.sshtunnelport, // Port of the redirected port
    keepAlive: true
  }
  let sshTunnel = tunnel(options, function () {
    console.log('SSH connection establishing...');
  });
  return sshTunnel;
}

function createRfbConnection(config, socket) {
  let rfbClient;
  if (Params.connType == 'rfbssh') {
    try {
      rfbClient = rfb.createConnection({
        host: '127.0.0.1', // SSH tunneling to localhost can be connected from local computer.
        port: config.sshtunnelport, // Port will be the redirected remote desktop port.
        password: config.password, // Remote desktop password
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection established: VNC with SSH tunneling.')
  } else {
    try {
      rfbClient = rfb.createConnection({
        host: config.host, // Remote desktop IP or hostname 
        port: config.port, // Remote desktop port
        password: config.password, // Remote desktop password
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection established: VNC.')
  }
  rfbConnect(rfbClient, socket); // Send connection details to client.
  rfbDrawScreen(rfbClient, socket); // Send screen data
  rfbErrorHandler(rfbClient); // Error handling
  return rfbClient;
}

function rfbConnect(rfbClient, socket) { // When VNC connected it sends screen size and resolves the Promise.
  rfbClient.on('connect', function () {
    socket.emit('remote', {
      width: rfbClient.width,
      height: rfbClient.height,
    });
  });
}

function rfbDrawScreen(rfbClient, socket) {
  rfbClient.on('rect', function (bitmap) { // rect event on VNC connection.
    let bufferSize = bitmap.width * bitmap.height * 3;  // Calculate screen size.
    let rgb = new Buffer.alloc(bufferSize, 'binary'); // Create maximum available buffer for alpha removal.
    
    try {
      // This loop removes alpha bytes. Loop occurs until it reaches end of the buffer.
      // Incrementing i 4 times neglects the aplha byte. Its saved on rgb.
      for (let i = 0, byte=0; i < bitmap.data.length; i += 4) {
        rgb[byte++] = bitmap.data[i + 2]; // Copy red to temporary buffer.
        rgb[byte++] = bitmap.data[i + 1]; // Copy green to temporary buffer.
        rgb[byte++] = bitmap.data[i];     // Copy blue to temporary buffer.
      }
    } catch (err) { // Error handler for alpha removal.
      console.log(err) //Lock screen bug on VNC occurs here.
    }

    let pngImage = new Jimp({ // Create an image from existing RGB data
      data: rgb, // Input file, can be file or buffer
      width: bitmap.width, // Width of created image
      height: bitmap.height, // Height of the created image
    });

    let buffer = getBuffer(pngImage); // Converts the RGB image. And to Base64

    socket.emit('frame', { // Send frame to client
      x: bitmap.x, // X coordinate of the left part of the image
      y: bitmap.y, // Y coordinate of the top part of the image
      width: bitmap.width, // Image width
      height: bitmap.height, // Image height
      image: buffer //Image file in Base64 string
    });

    rfbClient.requestUpdate(true, 0, 0, rfbClient.width, rfbClient.height); // Update the screen

    process.on('uncaughtException', function (err) {
      console.log('Caught exception: ', err);
    });
  });
}

function createRdpConnection(config, socket) {
  let rdpClient = rdp.createClient({
    domain: config.rdpdomainname,
    userName: config.rdpusername,
    password: config.password,
    enablePerf: true,
    autoLogin: true,
    decompress: true,
    screen: { width: config.rdpwidth, height: config.rdpheight },
    locale: 'en',
    logLevel: 'INFO'
  });
  rdpConnect(rdpClient, socket, config);
  rdpDraw(rdpClient, socket);
  rdpErrorHandler(rdpClient);
  if (Params.connType == 'rdpssh') {
    rdpClient.connect('127.0.0.1', config.sshtunnelport);
  }
  else {
    rdpClient.connect(config.host, config.port);
  }
  return rdpClient;
}

function rdpConnect(rdpClient, socket, config) {
  rdpClient.on('connect', function () {
    console.log('RDP connection successful...');
    socket.emit('remote', {
      width: config.rdpwidth,
      height: config.rdpheight,
    });
  });
}

function rdpDraw(rdpClient, socket) {
  rdpClient.on('bitmap', function (bitmap) {
    let pngImage = new Jimp({
      data: bitmap.data,
      width: bitmap.width,
      height: bitmap.height,
    });

    let buffer = getBuffer(pngImage);

    setTimeout(function () { }, 1000); //Slow down buffer process
    socket.emit('frame', {
      x: bitmap.destLeft,
      y: bitmap.destTop,
      width: bitmap.width,
      height: bitmap.height,
      image: buffer,
    });
  })
}

function getBuffer(pngImage) {
  let buffer;
  if (Params.compType == 'comppng') {
    pngImage.getBase64(Jimp.MIME_PNG, function (err, res) {
      buffer = res;
    });
  }
  if (Params.compType == 'compjpg') {
    pngImage.getBase64(Jimp.MIME_JPEG, function (err, res) {
      buffer = res;
    });
  }
  if (Params.compType == 'compbmp') {
    pngImage.getBase64(Jimp.MIME_BMP, function (err, res) {
      buffer = res;
    });
  }
  return buffer;
};

function rfbSocketHandler(rfbClient, socket) {
  socket.on('mouse', function (mouse) {
    rfbClient.pointerEvent(mouse.x, mouse.y, mouse.button);
  });
  socket.on('keys', function (keys) {
    rfbClient.keyEvent(keys.key, keys.state);
  });
  socket.on('disconnect', function () {
    rfbClient.end();
    console.log('Socket.io disconnected.');
  });
}

function rdpSocketHandler(rdpClient, socket) {
  socket.on('mouse', function (mouse) {
    rdpClient.sendPointerEvent(mouse.x, mouse.y, mouse.button, mouse.state);
  });
  socket.on('keys', function (keys) {
    rdpClient.sendKeyEventScancode(keys.key, keys.state);
  });
  socket.on('disconnect', function () {
    rdpClient.close();
    console.log('Socket.io disconnected.');
  });
}

function rfbErrorHandler(rfbClient) {
  rfbClient.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}
function rdpErrorHandler(rdpClient) {
  rdpClient.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}