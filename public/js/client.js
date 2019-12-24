const canvas = document.getElementById('rfb-canvas');
const canvasImage = canvas.getContext('2d');

function getMousePosition(canvas, e) {
  let canvasDim = canvas.getBoundingClientRect();
  return {
    x: e.clientX - canvasDim.left,
    y: e.clientY - canvasDim.top,
  };
}

const focusCanvas = function getFocus() {
  document.getElementById('rfb-canvas').focus();

  if (radVal == 'rdp') {
    document.addEventListener('keydown', this.handleKeyDown = function (e) {
      keyEventEmit(e.keyCode, null, 1);
      e.preventDefault();
    })
    document.addEventListener('keyup', this.handleKeyUp = function (e) {
      keyEventEmit(e.keyCode, null, 0);
      e.preventDefault();
    })
    
    function mouseMap(button) {
      switch(button) {
      case 0:
        return 1;
      case 2:
        return 2;
      default:
        return 0;
      }
    };

    canvas.addEventListener('mousemove', function (e) {
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, 0, false);
      return false;
    });
    canvas.addEventListener('mousedown', function (e) {
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), true);
      e.preventDefault();
      return false;
    });
    canvas.addEventListener('mouseup', function (e) {
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), false);
      e.preventDefault();
      return false;
    });
    canvas.addEventListener('contextmenu', function (e) {
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), false);
      e.preventDefault();
      return false;
    });
  }
  else {
    document.addEventListener('keydown', this.handleKeyDown = function (e) {
      keyEventEmit(e.keyCode, e.shiftKey, 1);
      e.preventDefault();
    })
    document.addEventListener('keyup', this.handleKeyUp = function (e) {
      keyEventEmit(e.keyCode, e.shiftKey, 0);
      e.preventDefault();
    })

    let mouseButton;
    canvas.addEventListener('mousedown', this.handleMouseDown = function (e) {
      mouseButton = 1;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('contextmenu', this.handleContextMenu = function (e) {
      mouseButton = 4;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('mouseup', this.handleMouseUp = function (e) {
      mouseButton = 0;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('mousemove', this.handleMouseMove = function (e) {
      //Bypass mouse button change in case dragging.
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('mousewheel', this.handleMouseWheel = function (e) {
      e = window.event || e;
      let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton);
    })
  }
};

document.getElementById('fullscreen').addEventListener('click', function () {
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen(); // Generic fullscreen
  } else if (canvas.mozRequestFullScreen) {
    canvas.mozRequestFullScreen(); // Firefox fullscreen
  } else if (canvas.webkitRequestFullscreen) {
    canvas.webkitRequestFullscreen(); // Chromium based fullscreen
  } else if (canvas.msRequestFullscreen) {
    canvas.msRequestFullscreen(); //Microsoft based fullscreen
  }
});

document.getElementById('ctrl-alt-del').addEventListener('click', function () {
  let nums = [17, 18, 46];
  for (let i = 0; i < nums.length; i++) {
    let n = nums[i];
    let k = keyMap[n][0];
    socket.emit('keys', {
      key: k,
      state: 1,
    });
  }
})

const copyFrame = function (rect) {
  let img = new Image();
  img.width = rect.width;
  img.height = rect.height;
  img.src = rect.image;
  img.onload = function () {
    canvasImage.drawImage(img, rect.x, rect.y, rect.width, rect.height);
  }
}

const connect = function (config) {
  socket.emit('remote', {
    host: config.host,
    port: config.port,
    sshtunnelport: config.sshtunnelport,
    sshport: config.sshport,
    password: config.password,
    sshusername: config.sshusername,
    sshpassword: config.sshpassword,
    rdpdomainname: config.rdpdomainname,
    rdpusername: config.rdpusername,
  });
  return new Promise(function (resolve, reject) {
    let timeout = setTimeout(function () {
      reject();
    }, 5000);
    socket.on('remote', function (config) {
      canvas.width = config.width;
      canvas.height = config.height;
      resolve();
      clearTimeout(timeout);
    });
    socket.on('frame', function (frame) {
      copyFrame(frame);
      console.log('Frame changed.');
    });
  });

};
const disconnect = function () {
  document.removeEventListener('keydown', this.handleKeyDown);
  document.removeEventListener('keyup', this.handleKeyUp);
  document.removeEventListener('mousedown', this.handleMouseDown);
  document.removeEventListener('contextmenu', this.handleContextMenu);
  document.removeEventListener('mouseup', this.handleMouseUp);
  document.removeEventListener('mousemove', this.handleMouseMove);
  document.removeEventListener('mousewheel', this.handleMouseWheel);
};

const mouseEventEmit = function (x, y, button, state) {
  socket.emit('mouse', {
    x: x,
    y: y,
    button: button,
    state: state,
  })
};

const keyEventEmit = function (key, shift, state) {
  if (radVal == 'rdp') {
    let unicode = rdpUnicode[key];
    let keyTransmit = rdpKeyMap[unicode];
    socket.emit('keys', {
      key: keyTransmit,
      state: state,
    });
  }
  else {
    let upLowKeys = rfbKeyMap[key];
    let keyTransmit;
    if (shift) {
      keyTransmit = upLowKeys[1];
    } else {
      keyTransmit = upLowKeys[0];
    }
    socket.emit('keys', {
      key: keyTransmit,
      state: state,
    });
  }
};