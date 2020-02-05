const socket = io.connect({'force new connection': true}); // Start Socket.io client

var radVal; // Assign an empty radio value
document.getElementById('rb-rfb').addEventListener('click', function() { // Change UI for VNC
  radVal = this.value;
  document.getElementById('sshuser').style.display = "none";
  document.getElementById('sshpass').style.display = "none";
  document.getElementById('sshport').style.display = "none";
  document.getElementById('sshtunnelport').style.display = "none";
  document.getElementById('port-lbl').innerHTML = "VNC Port:";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of VNC connection.";
  document.getElementById('pass-lbl').innerHTML = "VNC Password:";
  document.getElementById('password_help').innerHTML = "Please enter the password of VNC connection. Leave empty if there is no password.";
  document.getElementById('portnumber_help').innerHTML = "Please enter the port of VNC connection.";
  document.getElementById('portnumber').value = 5900;
  document.getElementById('rdpuser').style.display = "none";
  document.getElementById('rdpdomain').style.display = "none";
  document.getElementById('dimwidth').style.display = "none";
  document.getElementById('dimheight').style.display = "none";
  socket.emit('type', { // Transmit connection type
    conn: radVal
  });
});
document.getElementById('rb-rfb-ssh').addEventListener('click', function() { // Change UI for VNC-SSH
  radVal = this.value;
  document.getElementById('sshuser').style.display = "block";
  document.getElementById('sshpass').style.display = "block";
  document.getElementById('sshport').style.display = "block";
  document.getElementById('sshtunnelport').style.display = "block";
  document.getElementById('port-lbl').innerHTML = "VNC Port:";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of SSH connection.";
  document.getElementById('pass-lbl').innerHTML = "VNC Password:";
  document.getElementById('password_help').innerHTML = "Please enter the password of VNC connection. Leave empty if there is no password.";
  document.getElementById('portnumber_help').innerHTML = "Please enter the port of VNC connection.";
  document.getElementById('portnumber').value = 5900;
  document.getElementById('rdpuser').style.display = "none";
  document.getElementById('rdpdomain').style.display = "none";
  document.getElementById('dimwidth').style.display = "none";
  document.getElementById('dimheight').style.display = "none";
  socket.emit('type', { // Transmit connection type
    conn: radVal
  });
});
document.getElementById('rb-rdp').addEventListener('click', function() { // Change UI for RDP
  radVal = this.value;
  document.getElementById('sshuser').style.display = "none";
  document.getElementById('sshpass').style.display = "none";
  document.getElementById('sshport').style.display = "none";
  document.getElementById('sshtunnelport').style.display = "none";
  document.getElementById('port-lbl').innerHTML = "RDP Port:";
  document.getElementById('portnumber_help').innerHTML = "Please enter the port of RDP connection.";
  document.getElementById('portnumber').value = 3389;
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of RDP connection.";
  document.getElementById('pass-lbl').innerHTML = "RDP Password:";
  document.getElementById('password_help').innerHTML = "Please enter the password of RDP connection.";
  document.getElementById('rdpuser').style.display = "block";
  document.getElementById('rdpdomain').style.display = "block";
  document.getElementById('dimwidth').style.display = "block";
  document.getElementById('dimheight').style.display = "block";
  socket.emit('type', { // Transmit connection type
    conn: radVal
  });
});
document.getElementById('rb-rdp-ssh').addEventListener('click', function() { // Change UI for RDP-SSH
  radVal = this.value;
  document.getElementById('sshuser').style.display = "block";
  document.getElementById('sshpass').style.display = "block";
  document.getElementById('sshport').style.display = "block";
  document.getElementById('sshtunnelport').style.display = "block";
  document.getElementById('port-lbl').innerHTML = "RDP Port:";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of SSH connection.";
  document.getElementById('pass-lbl').innerHTML = "RDP Password:";
  document.getElementById('password_help').innerHTML = "Please enter the password of RDP connection.";
  document.getElementById('portnumber_help').innerHTML = "Please enter the port of RDP connection.";
  document.getElementById('portnumber').value = 3389;
  document.getElementById('rdpuser').style.display = "block";
  document.getElementById('rdpdomain').style.display = "block";
  document.getElementById('dimwidth').style.display = "block";
  document.getElementById('dimheight').style.display = "block";
  socket.emit('type', { // Transmit connection type
    conn: radVal
  });
});

function compEmit(compType) { // Transmit compression type
  socket.emit('comp', {
    comp: compType
  });
}

document.getElementById('comp-png').addEventListener('click', function() { // Add event listener to PNG button
  compType = this.value;
  compEmit(compType);
});
document.getElementById('comp-jpg').addEventListener('click', function() { // Add event listener to JPG button
  compType = this.value;
  compEmit(compType);
});
document.getElementById('comp-bmp').addEventListener('click', function() { // Add event listener to BMP button
  compType = this.value;
  compEmit(compType);
});
document.getElementById('disconnect-button').addEventListener('click', function() { // Removes canvas and reverts back to login page
  disconnect();
  document.getElementById('remote-screen').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
});

document.getElementById('login-button').addEventListener('click', function() { // Adding event listener for login
  focusCanvas(); // Function to add all event listeners for remote desktop. Detailed in client.js
  document.getElementById('loader').style.display = 'block'; // Display loading screen
  connect({ // Connects to remote desktops with parameters. Detailed in client.js
    host: document.getElementById('ipaddress').value, // IP or hostname of the remote desktop
    port: parseInt(document.getElementById('portnumber').value, 10), // Port of remote desktop
    password: document.getElementById('password').value, // Password for remote desktop
    sshtunnelport: parseInt(document.getElementById('sshtunnelportnumber').value, 10), // Port to tunnel SSH. Can be any port.
    sshport: parseInt(document.getElementById('sshportnumber').value, 10), // SSH connection port. Default 22
    sshusername: document.getElementById('sshusername').value, // SSH Username 
    sshpassword: document.getElementById('sshpassword').value, // SSH Password
    rdpdomainname: document.getElementById('rdpdomainname').value, // Domain name of RDP connection.
    rdpusername: document.getElementById('rdpusername').value, // Username of RDP connection.
    rdpwidth: parseInt(document.getElementById('width').value, 10), // Screen width of RDP desktop
    rdpheight: parseInt(document.getElementById('height').value, 10), // Screen height of RDP desktop
  }).then(function() {
    document.getElementById('loader').style.display = 'none'; // Remove loading screen
    document.getElementById('login-page').style.display = 'none'; // Hide the login page
    document.getElementById('remote-screen').style.display = 'block'; // Reveal the canvas display
  }).catch(function(err){ // Error handler
    console.log(err); // Display error log on console
    disconnect(); // If on error disconnect.
    document.getElementById('loader').style.display = 'none'; // If on error hide the loading screen
    alert('Connection failed!'); // Error message
  })
}, true);