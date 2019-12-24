var rfb = require('rfb2');
var io = require('socket.io');
var express = require('express');
var http = require('http');
var Jimp = require('jimp');
var tunnel = require('tunnel-ssh');
var rdp = require('node-rdpjs');
var arg = process.argv[2]; // Entering port number from the command lines
process.setMaxListeners(100);

var Config = {
  httpPort: arg || 8090,
  connType: 'rfb',
  compType: 'comppng',
};

var app = express();
var server = http.createServer(app);
app.use(express.static(__dirname + '/public/')); // Set "public" as web page root

server.listen(Config.httpPort);
console.log('Server listening on port: ', Config.httpPort);
console.log("Start server again with 'node " + process.argv[1].split("/").slice(-1)[0] + " [PORT_NUMBER]' to change port.");
io = io.listen(server);

io.sockets.on('connection', function (socket) {
  console.log('Socket.io entablished...');
  socket.on('type', function (type) {
    Config.connType = type.conn;
    console.log('Connection type changed to: ' + Config.connType);
  });
  socket.on('comp', function (comp) {
    Config.compType = comp.comp;
    console.log('Compression type changed to: ' + Config.compType);
  });
  socket.on('remote', function (config) {
    var rdpClient;
    if (Config.connType == 'rdp') {
      if (rdpClient) {
        rdpClient.close(); // Close previous connection
      };
      var rdpClient = createRdpConnection(config, socket);
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
    else {
      if (Config.connType == 'rfbssh') {
        createSSHtunnel(config);
      }
      var r = createRfbConnection(config, socket);
      socket.on('mouse', function (mouse) {
        r.pointerEvent(mouse.x, mouse.y, mouse.button);
      });
      socket.on('keys', function (keys) {
        r.keyEvent(keys.key, keys.state);
      });
      socket.on('disconnect', function () {
        r.end();
        console.log('Socket.io disconnected.');
      });
    }

  });
});

function createSSHtunnel(config) {
  var options = {
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
  tunnel(options, function (error, server) {
    console.log('SSH connection entablished...');
  });
}

function createRfbConnection(config, socket) {
  var r;
  if (Config.connType == 'rfbssh') {
    try {
      r = rfb.createConnection({
        host: '127.0.0.1',
        port: config.sshtunnelport,
        password: config.password,
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection entablished: VNC with SSH tunneling.')
  } else {
    try {
      r = rfb.createConnection({
        host: config.host,
        port: config.port,
        password: config.password,
      });
    } catch (err) {
      console.log(err);
    }
    console.log('Connection entablished: VNC.')
  }
  rfbConnect(r, socket);
  rfbDrawScreen(r, socket);
  rfbErrorHandler(r);
  return r;
}

function rfbConnect(r, socket) {
  r.on('connect', function () {
    socket.emit('remote', {
      width: r.width,
      height: r.height,
    });
  });
}

function rfbDrawScreen(r, socket) {
  r.on('rect', function (rect) {
    var bufferSize = rect.width * rect.height * 3;
    var rgb = new Buffer.alloc(bufferSize, 'binary');
    var offset = 0;

    try {
      for (var i = 0; i < rect.data.length; i += 4) {
        rgb[offset++] = rect.data[i + 2];
        rgb[offset++] = rect.data[i + 1];
        rgb[offset++] = rect.data[i];
      }
    } catch (err) {
      //Ignore error on unlock screen.
    }

    var pngImage = new Jimp({
      data: rgb,
      width: rect.width,
      height: rect.height,
    });

    var buffer;
    if (Config.compType == 'comppng') {
      pngImage.getBase64(Jimp.MIME_PNG, function (err, res) {
        buffer = res;
      });
    }
    if (Config.compType == 'compjpg') {
      pngImage.getBase64(Jimp.MIME_JPEG, function (err, res) {
        buffer = res;
      });
    }
    if (Config.compType == 'compbmp') {
      pngImage.getBase64(Jimp.MIME_BMP, function (err, res) {
        buffer = res;
      });
    }

    socket.emit('frame', {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      image: buffer
    });

    r.requestUpdate(true, 0, 0, r.width, r.height);

    process.on('uncaughtException', function (err) {
      console.log('Caught exception: ', err);
    });
  });
}

function createRdpConnection(config, socket) {
  var rdpClient = rdp.createClient({
    domain: config.rdpdomainname,
    userName: config.rdpusername,
    password: config.password,
    enablePerf: true,
    autoLogin: true,
    decompress: true,
    screen: { width: 1024, height: 768 },
    locale: 'en',
    logLevel: 'INFO'
  });
  rdpConnect(rdpClient, socket);
  rdpDraw(rdpClient, socket);
  rdpErrorHandler(rdpClient);
  rdpClient.connect(config.host, 3389);
  return rdpClient;
}

function rdpConnect(rdpClient, socket) {
  rdpClient.on('connect', function () {
    console.log('RDP connection successful...');
    socket.emit('remote', {
      width: 1024,
      height: 768,
    });
  });
}

function rdpDraw(rdpClient, socket) {
  rdpClient.on('bitmap', function (bitmap) {
    var pngImage = new Jimp({
      data: bitmap.data,
      width: bitmap.width,
      height: bitmap.height,
    });

    var buffer;
    pngImage.getBase64(Jimp.MIME_PNG, function (err, res) {
      buffer = res;
    });
    //console.log(bitmap);
    //new Promise(r => setTimeout(r, 1000));
    //setTimeout(function () { }, 1000); //Slow down buffer process
    socket.emit('frame', {
      x: bitmap.destLeft,
      y: bitmap.destTop,
      width: bitmap.width,
      height: bitmap.height,
      image: buffer,
    });
  })
}

function rfbErrorHandler(r, socket) {
  r.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}
function rdpErrorHandler(rdpClient, socket) {
  rdpClient.on('error', function (err) {
    console.error('Error occured: ', err);
  });
}