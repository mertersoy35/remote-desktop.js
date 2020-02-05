const canvas = document.getElementById('remote-canvas'); // Get canvas element
const canvasImage = canvas.getContext('2d'); // Change canvas type to 2-dimension

function getMousePosition(canvas, e) {
   // Gets relative mouse location on canvas. Useful when canvas is located at (0,0) on the page
  let canvasDim = canvas.getBoundingClientRect(); // Gets the canvas location of four edges on the page. Will not work on fullscreen.
  return {
    x: e.clientX - canvasDim.left, // Real mouse location on canvas by substracting X axis on the page and canvas location
    y: e.clientY - canvasDim.top, // Real mouse location on canvas by substracting Y axis on the page and canvas location
  };
}

const focusCanvas = function getFocus() { // Focuses canvas and adds evend handlers. Used in ui.js
  document.getElementById('remote-canvas').focus(); // Focuses on canvas to detect mouse clicks

  if (radVal == 'rdp' || radVal == 'rdpssh') { // Event listeners for RDP
    document.addEventListener('keydown', this.handleKeyDown = function (e) { // Add event listener for key press
      keyEventEmit(e.keyCode, null, 1); // Send parameters e.keycode and keyboard status to keyEventEmit function
      e.preventDefault();
    })
    document.addEventListener('keyup', this.handleKeyUp = function (e) { // Add event listener for key release
      keyEventEmit(e.keyCode, null, 0); // Send parameters e.keycode and keyboard status to keyEventEmit function
      e.preventDefault();
    })

    function mouseMap(button) {
      // RDP protocol in JS will not remember previous state of the mouse press when two events occur at same time
      // An example for this can be given for dragging files. This can be prevented by using cases and returning false at the end of event.
      // This will make a loop and dragging the files possible.
      switch (button) {
        case 0: // Left mouse button on JavaScript
          return 1; // Left mouse button on RDP
        case 2: // Right mouse click on JavaScript
          return 2; // Right mouse click on RDP
        default: // Mouse key is released on JavaScript
          return 0; // Mouse key is released on RDP
      }
    };

    canvas.addEventListener('mousemove', function (e) { // Add event listener for mouse movement
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, 0, false); // Send parameters mouse location fetched from getMousePosition to mouseEventEmit function
      return false;
    });
    canvas.addEventListener('mousedown', function (e) { // Add event listener for left mouse button press
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), true);
      e.preventDefault();
      return false;
    });
    canvas.addEventListener('mouseup', function (e) { // Add event listener for mouse button release
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), false);
      e.preventDefault();
      return false;
    });
    canvas.addEventListener('contextmenu', function (e) { // Add event listener for mouse right mouse button
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseMap(e.button), false);
      e.preventDefault();
      return false;
    });
  }
  else { // Event listeners for RFB protocol
    document.addEventListener('keydown', this.handleKeyDown = function (e) { // Add event listener for key press
      keyEventEmit(e.keyCode, e.shiftKey, 1);
      e.preventDefault();
    })
    document.addEventListener('keyup', this.handleKeyUp = function (e) { // Add event listener for key release
      keyEventEmit(e.keyCode, e.shiftKey, 0);
      e.preventDefault();
    })

    let mouseButton;
    canvas.addEventListener('mousedown', this.handleMouseDown = function (e) { // Add event listener for mouse button press
      mouseButton = 1;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('contextmenu', this.handleContextMenu = function (e) { // Add event listener for mouse right mouse button
      mouseButton = 4;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('mouseup', this.handleMouseUp = function (e) { // Add event listener for mouse button release
      mouseButton = 0;
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
    canvas.addEventListener('mousemove', this.handleMouseMove = function (e) { // Add event listener for mouse movement
      //Bypass mouse button change in case of dragging files.
      let mousePos = getMousePosition(this, e);
      mouseEventEmit(mousePos.x, mousePos.y, mouseButton, null);
      e.preventDefault();
    })
  }
};

document.getElementById('fullscreen').addEventListener('click', function () {
  // Fullscreen function. Mouse location detection is not working properly
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

document.getElementById('ctrl-alt-del').addEventListener('click', function () { // Function to send ctrl-alt-del
  // It is not possible to prevent default on key combination of ctrl-alt-del. Sending keys with a button is nessecary
  let nums = [17, 18, 46]; // JavaScript keys for ctrl-alt-del
  for (let i = 0; i < nums.length; i++) { // Loop for emmiting keys for ctrl-alt-del simultaneusly
    let n = nums[i];
    if (radVal == 'rfb' || radVal == 'rfbssh') {
      let k = rfbKeyMap[n][0];
      socket.emit('keys', {
        key: k,
        state: 1,
      });
    }
    if (radVal == 'rdp' || radVal == 'rdpssh') {
      let unicode = rdpUnicode[n];
      let k = rdpKeyMap[unicode];
      console.log(k);
      socket.emit('keys', {
        key: k,
        state: 1,
      })
    }
  }
})

const copyFrame = function (bitmap) { // Function to copy a frame to canvas
  let img = new Image(); // Create empty Image object
  img.width = bitmap.width; // Set image width same as recieved image
  img.height = bitmap.height; // Set image height same as recieved image
  img.src = bitmap.image; // Set the image data as recieved image data
  img.onload = function () {
    canvasImage.drawImage(img, bitmap.x, bitmap.y, bitmap.width, bitmap.height); // Draw image to canvas
    // First parameter is image data. second and third are corresponding location inside the canvas and last forth
    // and fifth  parameters are for image dimensions.
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
    rdpwidth: config.rdpwidth,
    rdpheight: config.rdpheight,
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
  if (radVal == 'rdp' || radVal == 'rdpssh') {
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