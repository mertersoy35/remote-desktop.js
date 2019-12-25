const socket = io.connect({'force new connection': true});

var radVal;
document.getElementById('rb-rfb').addEventListener('click', function() {
  radVal = this.value;
  document.getElementById('sshuser').style.display = "none";
  document.getElementById('sshpass').style.display = "none";
  document.getElementById('sshport').style.display = "none";
  document.getElementById('sshtunnelport').style.display = "none";
  document.getElementById('rfbport').style.display = "block";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of VNC connection.";
  document.getElementById('pass-lbl').innerHTML = "VNC Password:";
  document.getElementById('rdpuser').style.display = "none";
  document.getElementById('rdpdomain').style.display = "none";
  socket.emit('type', {
    conn: radVal
  });
});
document.getElementById('rb-rfb-ssh').addEventListener('click', function() {
  radVal = this.value;
  document.getElementById('sshuser').style.display = "block";
  document.getElementById('sshpass').style.display = "block";
  document.getElementById('sshport').style.display = "block";
  document.getElementById('sshtunnelport').style.display = "block";
  document.getElementById('rfbport').style.display = "block";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of SSH connection.";
  document.getElementById('pass-lbl').innerHTML = "VNC Password:";
  document.getElementById('rdpuser').style.display = "none";
  document.getElementById('rdpdomain').style.display = "none";
  socket.emit('type', {
    conn: radVal
  });
});
document.getElementById('rb-rdp').addEventListener('click', function() {
  radVal = this.value;
  document.getElementById('sshuser').style.display = "none";
  document.getElementById('sshpass').style.display = "none";
  document.getElementById('sshport').style.display = "none";
  document.getElementById('sshtunnelport').style.display = "none";
  document.getElementById('rfbport').style.display = "none";
  document.getElementById('ipaddress_help').innerHTML = "Please enter the IP address of RDP connection.";
  document.getElementById('pass-lbl').innerHTML = "RDP Password:";
  document.getElementById('rdpuser').style.display = "block";
  document.getElementById('rdpdomain').style.display = "block";
  socket.emit('type', {
    conn: radVal
  });
});

function compEmit(compType) {
  socket.emit('comp', {
    comp: compType
  });
}

document.getElementById('comp-png').addEventListener('click', function() {
  compType = this.value;
  compEmit(compType);
});
document.getElementById('comp-jpg').addEventListener('click', function() {
  compType = this.value;
  compEmit(compType);
});
document.getElementById('comp-bmp').addEventListener('click', function() {
  compType = this.value;
  compEmit(compType);
});
document.getElementById('disconnect-button').addEventListener('click', function() {
  disconnect();
  document.getElementById('rfb-screen').style.display = 'none';
  document.getElementById('login-page').style.display = 'block';
});

document.getElementById('login-button').addEventListener('click', function() {
  focusCanvas();
  document.getElementById('loader').style.display = 'block';
  connect({
    host: document.getElementById('ipaddress').value,
    port: parseInt(document.getElementById('portnumber').value, 10),
    password: document.getElementById('password').value,
    sshtunnelport: parseInt(document.getElementById('sshtunnelportnumber').value, 10),
    sshport: parseInt(document.getElementById('sshportnumber').value, 10),
    sshusername: document.getElementById('sshusername').value,
    sshpassword: document.getElementById('sshpassword').value,
    rdpdomainname: document.getElementById('rdpdomainname').value,
    rdpusername: document.getElementById('rdpusername').value,
  }).then(function() {
    document.getElementById('loader').style.display = 'none';
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('rfb-screen').style.display = 'block';
  }).catch(function(err){
    console.log(err);
    disconnect();
    document.getElementById('loader').style.display = 'none';
    alert('Connection failed!');
  })
}, true);