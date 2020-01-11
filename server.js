const express = require('express');
let io = require('socket.io');
const http = require('http');
const rfb = require('rfb2');
const rdp = require('node-rdpjs');
const Jimp = require('jimp');
const tunnel = require('tunnel-ssh');
const arg = process.argv[2]; // Entering port number from the command lines
process.setMaxListeners(100);

const Params = {
  httpPort: arg || 8090,
  connType: 'rfb',
  compType: 'comppng',
};

const app = express();
const server = http.createServer(app);
app.use(express.static(__dirname + '/public/')); // Set "public" as web page root

server.listen(Params.httpPort);
console.log('Server listening on port: ', Params.httpPort);
console.log("Start server again with 'node " + process.argv[1].split("/").slice(-1)[0] + " [PORT_NUMBER]' to change port.");
io = io.listen(server);

io.sockets.on('connection', function (socket) {
  console.log('Socket.io established...');
  socket.on('type', function (type) {
    Params.connType = type.conn;
    console.log('Connection type changed to: ' + Params.connType);
  });
  socket.on('comp', function (comp) {
    Params.compType = comp.comp;
    console.log('Compression type changed to: ' + Params.compType);
  });
  socket.on('remote', function (config) {
    if (Params.connType == 'rfb') {
      let rfbClient = createRfbConnection(config, socket);
      rfbSocketHandler(rfbClient, socket);
    }
    if (Params.connType == 'rfbssh') {
      let sshTunnel = createSSHtunnel(config);
      sshTunnel.on('error', function () {
        console.log('SSH connection error!');
      })
      let rfbClient = createRfbConnection(config, socket);
      rfbSocketHandler(rfbClient, socket);
    }
    if (Params.connType == 'rdp') {
      let rdpClient;
      if (rdpClient) {
        rdpClient.close(); // Close previous connection
      };
      rdpClient = createRdpConnection(config, socket);
      rdpSocketHandler(rdpClient, socket);
    }
    if (Params.connType == 'rdpssh') {
      let rdpClient;
      let sshTunnel = createSSHtunnel(config);
      sshTunnel.on('error', function () {
        console.log('SSH connection error!');
      })
      rdpClient = createRdpConnection(config, socket);
      rdpSocketHandler(rdpClient, socket);
    }
  });
});

function createSSHtunnel(config) {
  let options = {
    username: config.sshusername,
    password: config.sshpassword,
    host: config.host,
    port: config.sshport,
    dstHost: '127.0.0.1',
    dstPort: config.port,
    localHost: '127.0.0.1',
    localPort: config.sshtunnelport,
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
        host: '127.0.0.1',
        port: config.sshtunnelport,
        password: config.password,
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection established: VNC with SSH tunneling.')
  } else {
    try {
      rfbClient = rfb.createConnection({
        host: config.host,
        port: config.port,
        password: config.password,
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection established: VNC.')
  }
  rfbConnect(rfbClient, socket);
  rfbDrawScreen(rfbClient, socket);
  rfbErrorHandler(rfbClient);
  return rfbClient;
}

function rfbConnect(rfbClient, socket) {
  rfbClient.on('connect', function () {
    socket.emit('remote', {
      width: rfbClient.width,
      height: rfbClient.height,
    });
  });
}

function rfbDrawScreen(rfbClient, socket) {
  rfbClient.on('rect', function (bitmap) {
    let bufferSize = bitmap.width * bitmap.height * 3;
    let rgb = new Buffer.alloc(bufferSize, 'binary');
    let offset = 0;

    try {
      for (let i = 0; i < bitmap.data.length; i += 4) {
        rgb[offset++] = bitmap.data[i + 2];
        rgb[offset++] = bitmap.data[i + 1];
        rgb[offset++] = bitmap.data[i];
      }
    } catch (err) {
      //Ignore error on unlock screen.
    }

    let pngImage = new Jimp({
      data: rgb,
      width: bitmap.width,
      height: bitmap.height,
    });

    let buffer = getBuffer(pngImage);

    socket.emit('frame', {
      x: bitmap.x,
      y: bitmap.y,
      width: bitmap.width,
      height: bitmap.height,
      image: buffer
    });

    rfbClient.requestUpdate(true, 0, 0, rfbClient.width, rfbClient.height);

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

function rfbErrorHandler(rfbClient, socket) {
  rfbClient.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}
function rdpErrorHandler(rdpClient, socket) {
  rdpClient.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}